"use client";

import { useEffect, useState } from "react";

/** Carrega uma URL como HTMLImageElement (para uso no Konva). */
export function useImage(url?: string | null): HTMLImageElement | undefined {
  const [image, setImage] = useState<HTMLImageElement | undefined>();

  useEffect(() => {
    if (!url) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImage(undefined);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    const onLoad = () => setImage(img);
    img.addEventListener("load", onLoad);
    return () => img.removeEventListener("load", onLoad);
  }, [url]);

  return image;
}
