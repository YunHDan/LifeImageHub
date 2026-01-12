import GiderimLogo from "@/components/blocks/giderim-logo";
import IconGithub from "@/components/icons/github";
import { IconSmashing } from "@/components/icons/smashing";
import { IconWorld } from "@tabler/icons-react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formattedDate = (date: string) =>
	new Date(date).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
	});
export const formattedDateTimeline = (
	date: string,
	formatOpts?: Intl.DateTimeFormatOptions | undefined,
) =>
	new Date(date).toLocaleDateString(
		"en-US",
		formatOpts
			? formatOpts
			: {
					year: "numeric",
				},
	);

export const navItems = [
	{ href: "/", label: "Readme" },
	// { href: "/changelog", label: "Changelog" },
	// { href: "/notes", label: "Notes" }, // disabled for now
	// { href: "/projects", label: "Projects" },
	// { href: "/stack", label: "Stack" },
];

const dateFormat = {
	day: {
		year: "numeric" as const,
		month: "long" as const,
		day: "numeric" as const,
	},
	month: {
		year: "numeric" as const,
		month: "long" as const,
	},
	year: {
		year: "numeric" as const,
	},
};

type PhotoItem = {
  id?: string;
  src: string;             // 原来是 "/changelog/xxxxx.png"，现在可以是外部 URL 或相对路径
  thumb?: string;          // 可选缩略图 URL（也可以是相对路径）
  variant?: "1x1" | "4x3" | "4x5" | "9x16";
  caption?: string;
  place?: string;
  date?: string;           // ISO 字符串（可用于排序/展示）
  camera?: string;
  width?: number;
  height?: number;
};

type ChangelogItem = {
  date: string;
  event: string;
  title: string;
  description?: string;
  icon?: string;
  dateFormatOptions?: Intl.DateTimeFormatOptions; //(typeof dateFormat)[keyof typeof dateFormat]
  photos?: PhotoItem[];
};

const changelogItems: ChangelogItem[] = [
	{
		date: "2025-11-24",
		event: "announcement",
		title: "个人相册正式成立！",
		description: "经过数月的筹备和开发，我很高兴地宣布我的个人相册网站正式上线了！在这里，我将分享我生活中的点滴瞬间和摄影作品。欢迎大家前来浏览和交流！",
		dateFormatOptions: dateFormat.day,
		photos: [{ src:  "/finals1.jpg", variant: "4x5" }],
	},
] as const;

// 从环境变量读取基址，方便一次性切换到对象存储域名
const PHOTO_BASE = process.env.NEXT_PUBLIC_PHOTO_BASE || ""; // 例如 "https://cdn.example.com"

// 简单解析：如果已是完整 URL 则原样返回；否则把基址和相对路径拼接
function resolveSrc(s?: string) {
  if (!s) return s;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  // 确保没有重复斜杠
	if (!PHOTO_BASE) {
		// 未配置公开基址时，直接使用签名 API 的重定向作为图片 src，避免首屏 404
		const key = s.replace(/^\//, "");
		return `/api/sign?key=${encodeURIComponent(key)}`;
	}
	return PHOTO_BASE.replace(/\/$/, "") + "/" + s.replace(/^\//, "");
}

export const changelog = changelogItems
  .map((item) => ({
    ...item,
    photos: item.photos?.map((p) => ({
      ...p,
      src: resolveSrc(p.src),
      thumb: resolveSrc(p.thumb),
    })),
  }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

