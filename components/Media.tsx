"use client";
import { useState, type ReactNode } from "react";
import images from "@/data/images.json";

export default function Media({ imageKey, alt, caption = alt, className = "", priority = false, contain = false, children, onClick, label, selected }: {
  imageKey: string; alt: string; caption?: string; className?: string; priority?: boolean; contain?: boolean;
  children?: ReactNode; onClick?: () => void; label?: string; selected?: boolean;
}) {
  const src = (images as Record<string, string>)[imageKey];
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const available = src && failedSrc !== src;
  const content = <>{available && <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" style={{ objectFit: contain ? "contain" : "cover" }} onError={() => setFailedSrc(src)} />}{children ?? <span className="slot-caption">{caption}</span>}</>;
  const classes = "media-slot " + className + (available ? " has-image" : "") + (selected ? " is-selected" : "");
  return onClick ? <button type="button" className={classes} data-asset={imageKey} aria-label={label || alt} aria-pressed={selected} onClick={onClick}>{content}</button> : <div className={classes} data-asset={imageKey}>{content}</div>;
}
