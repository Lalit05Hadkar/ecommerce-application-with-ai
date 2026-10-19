"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK = "/images/placeholder.svg";

/**
 * Thin wrapper around next/image that swaps in a neutral local placeholder
 * if the remote image fails to load (dead URL, offline, etc.).
 */
export default function Img({ src, alt, ...rest }: ImageProps) {
  const [errored, setErrored] = useState(false);
  return (
    <Image
      src={errored ? FALLBACK : src}
      alt={alt}
      unoptimized={errored}
      onError={() => setErrored(true)}
      {...rest}
    />
  );
}
