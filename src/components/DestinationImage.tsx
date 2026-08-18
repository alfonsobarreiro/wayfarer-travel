"use client";

/**
 * DestinationImage
 * ─────────────────────────────────────────────────────────────────────────
 * Wrapper around `next/image` that survives Unsplash photo deletions.
 * If the primary `src` 404s, swap to `fallbackSrc`. If THAT fails too,
 * render a soft neutral panel instead of a broken-image icon.
 *
 * Use this everywhere a destination image is rendered — gallery tiles,
 * detail-page heroes, destination cards on the homepage and the grid.
 */

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

interface Props extends Omit<ImageProps, "src" | "onError"> {
  src:           string;
  fallbackSrc?:  string;
}

export function DestinationImage({ src, fallbackSrc, alt, className, style, ...rest }: Props) {
  const [stage, setStage] = useState<"primary" | "fallback" | "failed">("primary");

  if (stage === "failed") {
    // Soft neutral panel — blends with the warm-gray surface tokens
    return (
      <div
        className={className}
        style={{
          ...style,
          background:    "var(--color-neutral-100)",
          display:       "flex",
          alignItems:    "center",
          justifyContent:"center",
          color:         "var(--color-neutral-400)",
          fontSize:      11,
          fontFamily:    "var(--font-body), system-ui, sans-serif",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
        aria-label={alt}
        role="img"
      >
        Image unavailable
      </div>
    );
  }

  const activeSrc = stage === "primary" ? src : fallbackSrc!;

  return (
    <Image
      {...rest}
      src={activeSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (stage === "primary" && fallbackSrc && fallbackSrc !== src) {
          setStage("fallback");
        } else {
          setStage("failed");
        }
      }}
    />
  );
}
