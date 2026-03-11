"use client";

interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
}

export function ImageSkeleton({
  className = "",
  aspectRatio = "video",
}: ImageSkeletonProps) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "",
  };

  return (
    <div
      className={`
        bg-gradient-to-r from-slate-200 to-slate-100 
        dark:from-slate-700 dark:to-slate-600 
        animate-pulse rounded-xl overflow-hidden
        ${aspectClasses[aspectRatio]}
        ${className}
      `}
    />
  );
}
