"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { EditorData } from "./canvas-editor";

const CanvasEditor = dynamic(() => import("./canvas-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center text-muted">
      <Loader2 className="animate-spin" />
    </div>
  ),
});

export function EditorLoader({ data }: { data: EditorData }) {
  return <CanvasEditor data={data} />;
}
