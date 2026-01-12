/* eslint-disable @next/next/no-img-element */
"use client";
import Polaroid, { type polaroidVariants } from "@/components/blocks/polaroid";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type TImage = {
  src: string; // can be object key like "changelog/finals1.jpg" or full URL
  thumb?: string; // optional thumb key or full URL
  variant: keyof typeof polaroidVariants;
};

const PolaroidGallery = ({
  images,
  event,
  title,
}: {
  images: Array<TImage>;
  event: string;
  title?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // state 保存每张图片的签名 thumb URL（或原始完整 URL）
  const [thumbUrls, setThumbUrls] = useState<(string | null)[]>(
    () => images.map(() => null),
  );
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);

  useEffect(() => {
    if (isInView && !isVisible) setIsVisible(true);
  }, [isInView, isVisible]);

  // 工具：如果传入的是完整 URL，则直接返回；否则调用 /api/sign?key=...
  async function resolveSignedUrl(keyOrUrl: string) {
    if (!keyOrUrl) return null;
    // 已经是完整 URL 或本身就是我们提供的签名路由，直接返回
    if (/^https?:\/\//i.test(keyOrUrl)) return keyOrUrl;
    if (keyOrUrl.startsWith("/api/sign")) return keyOrUrl;
    try {
      // 以 JSON 模式获取签名 URL，避免 <img> 直接命中 JSON 响应
      const res = await fetch(`/api/sign?mode=json&key=${encodeURIComponent(keyOrUrl)}`);
      if (res.ok) {
        const data = await res.json();
        return data?.url ?? null;
      }
    } catch (e) {
      console.warn("resolveSignedUrl failed for", keyOrUrl, e);
    }
    // fallback: 如果配置了 NEXT_PUBLIC_PHOTO_BASE，拼接试试（仅在公开可访问时有效）
    const base = (process.env.NEXT_PUBLIC_PHOTO_BASE as string) || "";
    if (base) return base.replace(/\/$/, "") + "/" + keyOrUrl.replace(/^\//, "");
    // 最后兜底：直接走重定向模式的签名 API（<img src> 可用）
    return `/api/sign?key=${encodeURIComponent(keyOrUrl)}`;
  }

  // 预取缩略图签名 URL（可以限制只为视口内或首 N 项预取以优化）
  useEffect(() => {
    let cancelled = false;
    async function fetchThumbs() {
      const results: (string | null)[] = [...thumbUrls];
      await Promise.all(
        images.map(async (img, i) => {
          if (results[i]) return;
          const key = img.thumb || img.src;
          const url = await resolveSignedUrl(key);
          if (!cancelled) results[i] = url;
        }),
      );
      if (!cancelled) setThumbUrls(results);
    }
    fetchThumbs();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // Viewer 打开时获取原图的签名 URL（或使用已是完整 URL 的 src）
  const openViewer = useCallback(
    async (index: number) => {
      setCurrentIndex(index);
      setIsImageLoading(true);
      setIsViewerOpen(true);
      const keyOrUrl = images[index]?.src;
      const signed = await resolveSignedUrl(keyOrUrl);
      setViewerSrc(signed ?? keyOrUrl);
    },
    [images],
  );

  const closeViewer = useCallback(() => {
    setIsViewerOpen(false);
    setViewerSrc(null);
    setIsImageLoading(false);
  }, []);

  const nextImage = useCallback(() => {
    setIsImageLoading(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setIsImageLoading(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // 当 currentIndex 变化时切换 viewerSrc（支持左右切换）
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isViewerOpen) return;
      const keyOrUrl = images[currentIndex]?.src;
      if (!keyOrUrl) return;
      setIsImageLoading(true);
      const signed = await resolveSignedUrl(keyOrUrl);
      if (!cancelled) setViewerSrc(signed ?? keyOrUrl);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [currentIndex, images, isViewerOpen]);

  // 键盘监听略（按需保留）
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!isViewerOpen) return;
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    }
    if (isViewerOpen) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [isViewerOpen, closeViewer, nextImage, prevImage]);

  return (
    <>
      <div ref={ref} className="relative mb-4 mt-2 p-2" style={{ height: 160 }}>
        {images.map((image, index) => (
          <Polaroid
            isVisible={isVisible}
            index={index}
            total={images.length}
            key={`${image.src}-${index}`}
            variant={image.variant}
            onClick={() => openViewer(index)}
            // 传给 Polaroid 的 src 使用我们解析/签名后的 thumb（若可用），否则传原始 src
            src={thumbUrls[index] ?? image.src}
          />
        ))}
      </div>

      {/* 以下 viewer 使用普通 <img> 以便加载签名私有 URL */}
      <AnimatePresence>
        {isViewerOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-black/90" onClick={closeViewer} />
            <div className="relative z-10 w-full h-full flex flex-col p-6">
              <div className="flex items-center justify-between text-white mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{event}</h2>
                  {title && <p className="text-gray-300 mt-1">{title}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    {currentIndex + 1} / {images.length}
                  </span>
                  <button onClick={closeViewer} className="p-2 rounded-full">
                    Close
                  </button>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={viewerSrc ?? images[currentIndex]?.src}
                  alt=""
                  style={{ maxWidth: "95%", maxHeight: "80vh", objectFit: "contain" }}
                  onLoad={() => setIsImageLoading(false)}
                />
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-8 mt-4">
                <button onClick={prevImage} className="p-3 rounded-full" disabled={images.length <= 1}>
                  Prev
                </button>
                <button onClick={nextImage} className="p-3 rounded-full" disabled={images.length <= 1}>
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PolaroidGallery;