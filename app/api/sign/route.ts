import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * 生成七牛私有下载链接的简单实现（不依赖 qiniu SDK 的 privateDownloadUrl）。
 * 算法说明（与 qiniu SDK 保持一致）：
 *  - privateUrl = baseUrl + (baseUrl包含? ? '&' : '?') + 'e=' + deadline + '&token=' + accessKey + ':' + urlsafe_base64(hmac_sha1(baseUrl + '\n' + deadline, secretKey))
 *
 * 注意：请在部署环境设置以下 env（本地使用 .env.local）:
 * QINIU_ACCESS_KEY, QINIU_SECRET_KEY, QINIU_BUCKET_DOMAIN（例如 https://img.drhlife.top，不带查询参数）
 */

// 简单内存缓存，生产环境请用 Redis 等共享缓存
const cache = new Map<string, { url: string; expiresAt: number }>();

function base64UrlSafe(input: Buffer): string {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * 生成七牛私有下载 URL（与官方 SDK 行为保持一致）：
 * baseUrl = domain + '/' + encodeURI(key)
 * if baseUrl has '?', append '&e=' + deadline else '?e=' + deadline
 * signature = HMAC_SHA1(baseUrl_with_e, secretKey)
 * token = accessKey + ':' + urlsafe_base64(signature)
 * final = baseUrl_with_e + '&token=' + token
 */
function makePrivateDownloadUrl(baseUrl: string, ttlSeconds: number, accessKey: string, secretKey: string): string {
  const deadline = Math.floor(Date.now() / 1000) + ttlSeconds;
  const sep = baseUrl.includes("?") ? "&" : "?";
  const urlWithDeadline = `${baseUrl}${sep}e=${deadline}`;
  const hmac = crypto.createHmac("sha1", secretKey).update(urlWithDeadline).digest();
  const encoded = base64UrlSafe(hmac);
  const token = `${accessKey}:${encoded}`;
  return `${urlWithDeadline}&token=${token}`;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    let key = url.searchParams.get("key") || "";
    const mode = url.searchParams.get("mode") || "redirect"; // redirect | json
    if (!key) {
      return NextResponse.json({ error: "missing key" }, { status: 400 });
    }

    // normalize：去掉前导斜杠
    if (key.startsWith("/")) key = key.slice(1);

    const accessKey = process.env.QINIU_ACCESS_KEY;
    const secretKey = process.env.QINIU_SECRET_KEY;
    const domain = process.env.QINIU_BUCKET_DOMAIN; // e.g. https://img.drhlife.top

    if (!accessKey || !secretKey || !domain) {
      console.error("Qiniu env missing:", { accessKey: !!accessKey, secretKey: !!secretKey, domain: !!domain });
      return NextResponse.json({ error: "server not configured" }, { status: 500 });
    }

    // 检查缓存
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && cached.expiresAt > now) {
      // 注意：缓存命中时也要遵循 mode。
      // 否则 <img src="/api/sign?..."> 会拿到 JSON 响应，导致刷新后图片无法显示。
      if (mode === "json") {
        return NextResponse.json({ url: cached.url });
      }
      return NextResponse.redirect(cached.url);
    }

    // 构造未签名的基础 URL（注意要对 key 做 encodeURI）
    const baseUrl = domain.replace(/\/$/, "") + "/" + encodeURI(key);

    // 生成签名 URL（ttl 可调）
    const ttlSeconds = 60 * 30; // 30 分钟
    const privateUrl = makePrivateDownloadUrl(baseUrl, ttlSeconds, accessKey, secretKey);

    // 缓存（比 ttl 少 5 秒避免边界）
    cache.set(key, { url: privateUrl, expiresAt: now + ttlSeconds * 1000 - 5000 });

    // 两种返回模式：json（用于前端异步获取）或重定向（用于 <img src> 直接加载）
    if (mode === "json") {
      return NextResponse.json({ url: privateUrl });
    }
    return NextResponse.redirect(privateUrl);
  } catch (err) {
    console.error("Error in /api/sign:", err);
    return NextResponse.json({ error: "internal_error", detail: String(err) }, { status: 500 });
  }
}