"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Stage,
  Layer as KonvaLayer,
  Image as KonvaImage,
  Text as KonvaText,
  Transformer,
  Rect,
} from "react-konva";
import type Konva from "konva";
import {
  Type,
  ImagePlus,
  Trash2,
  Download,
  Save,
  ArrowLeft,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useImage } from "./use-image";
import type { LayerData } from "@/lib/validation";
import type { FormatMeta } from "@/lib/formats";

const DISPLAY_MAX = 520;

const BASE_FONTS = [
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Impact",
  "Trebuchet MS",
];

export interface EditorData {
  generationId: string;
  format: FormatMeta;
  rawImageUrl: string;
  composedImageUrl: string | null;
  savedLayers: LayerData[] | null;
  texts: { mainText?: string | null; secondaryText?: string | null; cta?: string | null };
  client: {
    logoUrl: string | null;
    brandColors: string[];
    fonts: { name: string; url?: string }[];
  };
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function CanvasEditor({ data }: { data: EditorData }) {
  const router = useRouter();
  const { format } = data;

  // Escala de exibição (mantém proporção real do formato)
  const scale = DISPLAY_MAX / Math.max(format.width, format.height);
  const displayW = Math.round(format.width * scale);
  const displayH = Math.round(format.height * scale);
  const pixelRatio = format.width / displayW;

  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const bgImage = useImage(data.rawImageUrl);
  const brandColors = data.client.brandColors.length
    ? data.client.brandColors
    : ["#ffffff", "#000000"];
  const fontOptions = useMemo(
    () => [...data.client.fonts.map((f) => f.name).filter(Boolean), ...BASE_FONTS],
    [data.client.fonts],
  );

  const [layers, setLayers] = useState<LayerData[]>(() =>
    data.savedLayers && data.savedLayers.length
      ? data.savedLayers
      : buildDefaultLayers(data, displayW, displayH, fontOptions[0] ?? "Arial", brandColors[0]),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const selected = layers.find((l) => l.id === selectedId) ?? null;

  // Carrega fontes do cliente que possuem URL
  useEffect(() => {
    data.client.fonts.forEach((f) => {
      if (f.url && f.name) {
        const face = new FontFace(f.name, `url(${f.url})`);
        face
          .load()
          .then((loaded) => document.fonts.add(loaded))
          .catch(() => {});
      }
    });
  }, [data.client.fonts]);

  // Conecta o Transformer ao nó selecionado
  useEffect(() => {
    const tr = trRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;
    if (!selectedId) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }
    const node = stage.findOne<Konva.Node>(`#${selectedId}`);
    tr.nodes(node ? [node] : []);
    tr.getLayer()?.batchDraw();
  }, [selectedId, layers]);

  function update(id: string, patch: Partial<LayerData>) {
    setLayers((arr) => arr.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function addText() {
    const l: LayerData = {
      id: uid(),
      type: "text",
      text: "Novo texto",
      fontFamily: fontOptions[0] ?? "Arial",
      fontSize: Math.round(displayH * 0.06),
      fontStyle: "bold",
      fill: brandColors[0] ?? "#ffffff",
      align: "center",
      x: displayW * 0.1,
      y: displayH * 0.4,
      width: displayW * 0.8,
    };
    setLayers((arr) => [...arr, l]);
    setSelectedId(l.id);
  }

  function addLogo() {
    if (!data.client.logoUrl) return;
    const size = displayW * 0.25;
    const l: LayerData = {
      id: uid(),
      type: "logo",
      src: data.client.logoUrl,
      x: displayW * 0.05,
      y: displayH * 0.05,
      width: size,
      height: size,
    };
    setLayers((arr) => [...arr, l]);
    setSelectedId(l.id);
  }

  function removeSelected() {
    if (!selectedId) return;
    setLayers((arr) => arr.filter((l) => l.id !== selectedId));
    setSelectedId(null);
  }

  function exportDataUrl(): string {
    setSelectedId(null);
    const stage = stageRef.current!;
    // garante que o transformer não apareça na exportação
    trRef.current?.nodes([]);
    return stage.toDataURL({ pixelRatio, mimeType: "image/png" });
  }

  async function save() {
    setSaving(true);
    setSavedMsg(null);
    try {
      const dataUrl = exportDataUrl();
      const res = await fetch(`/api/generations/${data.generationId}/composition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layers, composedImageDataUrl: dataUrl }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Falha ao salvar");
      }
      setSavedMsg("Arte salva no histórico ✓");
      router.refresh();
    } catch (e) {
      setSavedMsg(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  function download() {
    const dataUrl = exportDataUrl();
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `arte-${data.generationId}.png`;
    a.click();
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Canvas */}
      <div className="flex flex-col items-center gap-3">
        <div className="inline-block rounded-xl border border-border bg-surface p-3 shadow-sm">
          <Stage
            ref={stageRef}
            width={displayW}
            height={displayH}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) setSelectedId(null);
            }}
          >
            <KonvaLayer>
              {bgImage ? (
                <KonvaImage image={bgImage} width={displayW} height={displayH} />
              ) : (
                <Rect width={displayW} height={displayH} fill="#e5e7eb" />
              )}

              {layers.map((l) =>
                l.type === "text" ? (
                  <KonvaText
                    key={l.id}
                    id={l.id}
                    text={l.text ?? ""}
                    x={l.x}
                    y={l.y}
                    width={l.width}
                    fontSize={l.fontSize ?? 32}
                    fontFamily={l.fontFamily ?? "Arial"}
                    fontStyle={l.fontStyle ?? "normal"}
                    fill={l.fill ?? "#ffffff"}
                    align={l.align ?? "left"}
                    rotation={l.rotation ?? 0}
                    draggable
                    onClick={() => setSelectedId(l.id)}
                    onTap={() => setSelectedId(l.id)}
                    onDragEnd={(e) => update(l.id, { x: e.target.x(), y: e.target.y() })}
                    onTransformEnd={(e) => {
                      const node = e.target as Konva.Text;
                      const sx = node.scaleX();
                      node.scaleX(1);
                      node.scaleY(1);
                      update(l.id, {
                        x: node.x(),
                        y: node.y(),
                        rotation: node.rotation(),
                        width: Math.max(20, (l.width ?? displayW) * sx),
                        fontSize: Math.max(8, (l.fontSize ?? 32) * sx),
                      });
                    }}
                  />
                ) : (
                  <LogoNode
                    key={l.id}
                    layer={l}
                    onSelect={() => setSelectedId(l.id)}
                    onChange={(patch) => update(l.id, patch)}
                  />
                ),
              )}

              <Transformer
                ref={trRef}
                rotateEnabled
                boundBoxFunc={(oldBox, newBox) =>
                  newBox.width < 20 || newBox.height < 20 ? oldBox : newBox
                }
              />
            </KonvaLayer>
          </Stage>
        </div>
        <p className="text-xs text-muted">
          {format.label} · {format.width}×{format.height}px · arraste e redimensione as camadas
        </p>
      </div>

      {/* Painel lateral */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => router.push("/history")}>
            <ArrowLeft size={14} /> Voltar
          </Button>
          <Button size="sm" variant="secondary" onClick={addText}>
            <Type size={14} /> Texto
          </Button>
          {data.client.logoUrl ? (
            <Button size="sm" variant="secondary" onClick={addLogo}>
              <ImagePlus size={14} /> Logo
            </Button>
          ) : null}
          <Button size="sm" onClick={save} disabled={saving}>
            <Save size={14} /> {saving ? "Salvando..." : "Salvar"}
          </Button>
          <Button size="sm" variant="secondary" onClick={download}>
            <Download size={14} /> Baixar
          </Button>
        </div>
        {savedMsg ? <p className="text-sm text-brand">{savedMsg}</p> : null}

        {/* Lista de camadas */}
        <div className="rounded-xl border border-border bg-surface p-3">
          <p className="mb-2 text-sm font-semibold">Camadas</p>
          <div className="space-y-1">
            {layers.length === 0 ? (
              <p className="text-xs text-muted">Nenhuma camada. Adicione texto ou logo.</p>
            ) : (
              layers.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedId(l.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm ${
                    selectedId === l.id ? "bg-background ring-1 ring-ring" : "hover:bg-background"
                  }`}
                >
                  {l.type === "text" ? <Type size={14} /> : <ImagePlus size={14} />}
                  <span className="truncate">
                    {l.type === "text" ? l.text || "(texto vazio)" : "Logo"}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Propriedades */}
        {selected && selected.type === "text" ? (
          <div className="space-y-3 rounded-xl border border-border bg-surface p-3">
            <p className="text-sm font-semibold">Texto</p>
            <textarea
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
              value={selected.text ?? ""}
              onChange={(e) => update(selected.id, { text: e.target.value })}
              rows={2}
            />

            <div className="flex items-center gap-2">
              <select
                className="h-9 flex-1 rounded-lg border border-border bg-surface px-2 text-sm"
                value={selected.fontFamily ?? "Arial"}
                onChange={(e) => update(selected.id, { fontFamily: e.target.value })}
              >
                {fontOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="h-9 w-20 rounded-lg border border-border bg-surface px-2 text-sm"
                value={Math.round(selected.fontSize ?? 32)}
                onChange={(e) =>
                  update(selected.id, { fontSize: Number(e.target.value) || 8 })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <IconToggle
                active={(selected.fontStyle ?? "").includes("bold")}
                onClick={() => update(selected.id, { fontStyle: toggleStyle(selected.fontStyle, "bold") })}
              >
                <Bold size={14} />
              </IconToggle>
              <IconToggle
                active={(selected.fontStyle ?? "").includes("italic")}
                onClick={() => update(selected.id, { fontStyle: toggleStyle(selected.fontStyle, "italic") })}
              >
                <Italic size={14} />
              </IconToggle>
              <span className="mx-1 h-5 w-px bg-border" />
              <IconToggle active={selected.align === "left"} onClick={() => update(selected.id, { align: "left" })}>
                <AlignLeft size={14} />
              </IconToggle>
              <IconToggle active={selected.align === "center"} onClick={() => update(selected.id, { align: "center" })}>
                <AlignCenter size={14} />
              </IconToggle>
              <IconToggle active={selected.align === "right"} onClick={() => update(selected.id, { align: "right" })}>
                <AlignRight size={14} />
              </IconToggle>
            </div>

            <div>
              <p className="mb-1 text-xs text-muted">Cor</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-9 cursor-pointer rounded border border-border"
                  value={selected.fill ?? "#ffffff"}
                  onChange={(e) => update(selected.id, { fill: e.target.value })}
                />
                {brandColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => update(selected.id, { fill: c })}
                    className="h-7 w-7 rounded-full border border-border"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            <Button variant="danger" size="sm" onClick={removeSelected}>
              <Trash2 size={14} /> Remover camada
            </Button>
          </div>
        ) : selected ? (
          <div className="space-y-3 rounded-xl border border-border bg-surface p-3">
            <p className="text-sm font-semibold">Logo</p>
            <p className="text-xs text-muted">Arraste e redimensione no canvas.</p>
            <Button variant="danger" size="sm" onClick={removeSelected}>
              <Trash2 size={14} /> Remover camada
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted">Selecione uma camada para editar.</p>
        )}
      </div>
    </div>
  );
}

function LogoNode({
  layer,
  onSelect,
  onChange,
}: {
  layer: LayerData;
  onSelect: () => void;
  onChange: (patch: Partial<LayerData>) => void;
}) {
  const img = useImage(layer.src);
  if (!img) return null;
  return (
    <KonvaImage
      id={layer.id}
      image={img}
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      rotation={layer.rotation ?? 0}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={(e) => {
        const node = e.target as Konva.Image;
        const sx = node.scaleX();
        const sy = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(10, (layer.width ?? 100) * sx),
          height: Math.max(10, (layer.height ?? 100) * sy),
        });
      }}
    />
  );
}

function IconToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
        active ? "border-brand bg-background text-brand" : "border-border hover:bg-background"
      }`}
    >
      {children}
    </button>
  );
}

function toggleStyle(current: string | undefined, token: "bold" | "italic"): string {
  const set = new Set((current ?? "").split(" ").filter(Boolean).filter((s) => s !== "normal"));
  if (set.has(token)) set.delete(token);
  else set.add(token);
  return set.size ? Array.from(set).join(" ") : "normal";
}

function buildDefaultLayers(
  data: EditorData,
  displayW: number,
  displayH: number,
  font: string,
  color: string,
): LayerData[] {
  const out: LayerData[] = [];
  const { mainText, secondaryText, cta } = data.texts;

  if (data.client.logoUrl) {
    const size = displayW * 0.22;
    out.push({
      id: uid(),
      type: "logo",
      src: data.client.logoUrl,
      x: displayW * 0.05,
      y: displayH * 0.05,
      width: size,
      height: size,
    });
  }
  if (mainText?.trim()) {
    out.push({
      id: uid(),
      type: "text",
      text: mainText,
      fontFamily: font,
      fontSize: Math.round(displayH * 0.08),
      fontStyle: "bold",
      fill: color,
      align: "center",
      x: displayW * 0.1,
      y: displayH * 0.35,
      width: displayW * 0.8,
    });
  }
  if (secondaryText?.trim()) {
    out.push({
      id: uid(),
      type: "text",
      text: secondaryText,
      fontFamily: font,
      fontSize: Math.round(displayH * 0.045),
      fontStyle: "normal",
      fill: color,
      align: "center",
      x: displayW * 0.1,
      y: displayH * 0.52,
      width: displayW * 0.8,
    });
  }
  if (cta?.trim()) {
    out.push({
      id: uid(),
      type: "text",
      text: cta,
      fontFamily: font,
      fontSize: Math.round(displayH * 0.04),
      fontStyle: "bold",
      fill: color,
      align: "center",
      x: displayW * 0.1,
      y: displayH * 0.8,
      width: displayW * 0.8,
    });
  }
  return out;
}
