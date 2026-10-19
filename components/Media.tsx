"use client";

import { useState } from "react";
import images from "@/data/images.json";

export default function Media({ imageKey, alt, className = "", priority = false, contain = false }: {
  imageKey: string; alt: string; className?: string; priority?: boolean; contain?: boolean;
}) {
  const src = (images as Record<string, string>)[imageKey];
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const available = src && failedSrc !== src;
  return <div className={`media-slot ${className} ${available ? "has-image" : ""}`} data-asset={imageKey}>
    {available ? <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" style={{ objectFit: contain ? "contain" : "cover" }} onError={() => setFailedSrc(src)} /> :
      <div className="media-placeholder"><span aria-hidden="true" className="placeholder-star">✳</span><span>{alt}</span><small>IMAGEN EN PREPARACIÓN</small></div>}
  </div>;
}
