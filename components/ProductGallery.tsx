"use client";

import { useState } from "react";
import Img from "./Img";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const src = images[active] ?? images[0];

  return (
    <div>
      <div className="gallery-main">
        <Img src={src} alt={name} fill priority sizes="(max-width: 900px) 100vw, 55vw" />
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((image, i) => (
            <button
              key={i}
              className={`gallery-thumb${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
            >
              <Img src={image} alt="" fill sizes="76px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
