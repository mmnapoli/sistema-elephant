"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import { ImageUpload, uploadFile } from "@/components/image-upload";
import { createClient, updateClient } from "@/app/(app)/clients/actions";
import type { ClientInput } from "@/lib/validation";

type FontEntry = { name: string; url?: string };

export interface ClientFormInitial {
  id?: string;
  name?: string;
  logoUrl?: string | null;
  brandColors?: string[];
  fonts?: FontEntry[];
  styleDescription?: string | null;
  visualRules?: string | null;
  restrictions?: string | null;
  basePrompt?: string | null;
  referenceImages?: string[];
}

export function ClientForm({ initial }: { initial?: ClientFormInitial }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [logoUrl, setLogoUrl] = useState<string | null>(initial?.logoUrl ?? null);
  const [colors, setColors] = useState<string[]>(initial?.brandColors ?? []);
  const [fonts, setFonts] = useState<FontEntry[]>(initial?.fonts ?? []);
  const [styleDescription, setStyleDescription] = useState(initial?.styleDescription ?? "");
  const [visualRules, setVisualRules] = useState(initial?.visualRules ?? "");
  const [restrictions, setRestrictions] = useState(initial?.restrictions ?? "");
  const [basePrompt, setBasePrompt] = useState(initial?.basePrompt ?? "");
  const [refs, setRefs] = useState<string[]>(initial?.referenceImages ?? []);

  const isEdit = !!initial?.id;

  function submit() {
    setError(null);
    const payload: ClientInput = {
      name,
      logoUrl: logoUrl ?? "",
      brandColors: colors.filter(Boolean),
      fonts: fonts.filter((f) => f.name.trim()),
      styleDescription,
      visualRules,
      restrictions,
      basePrompt,
      referenceImages: refs,
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateClient(initial!.id!, payload)
        : await createClient(payload);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/clients");
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-4">
        <Field label="Nome do cliente">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Padaria do Zé"
          />
        </Field>

        <Field label="Logo" hint="Usado como camada no editor das artes.">
          <ImageUpload value={logoUrl} onChange={setLogoUrl} label="Enviar logo" />
        </Field>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-semibold">Identidade visual</h3>

        {/* Cores */}
        <Field label="Paleta de cores" hint="Cores principais da marca (#RRGGBB).">
          <div className="flex flex-wrap items-center gap-2">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-1">
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(c) ? c : "#000000"}
                  onChange={(e) =>
                    setColors((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))
                  }
                  className="h-9 w-9 cursor-pointer rounded border border-border"
                />
                <Input
                  value={c}
                  onChange={(e) =>
                    setColors((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))
                  }
                  className="w-28"
                />
                <button
                  type="button"
                  onClick={() => setColors((arr) => arr.filter((_, j) => j !== i))}
                  className="text-muted hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setColors((arr) => [...arr, "#000000"])}
            >
              <Plus size={14} /> Cor
            </Button>
          </div>
        </Field>

        {/* Fontes */}
        <Field label="Fontes" hint="Nome da fonte (e URL opcional para uso no editor).">
          <div className="space-y-2">
            {fonts.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={f.name}
                  placeholder="Ex: Montserrat"
                  onChange={(e) =>
                    setFonts((arr) =>
                      arr.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)),
                    )
                  }
                />
                <Input
                  value={f.url ?? ""}
                  placeholder="URL (opcional)"
                  onChange={(e) =>
                    setFonts((arr) =>
                      arr.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)),
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => setFonts((arr) => arr.filter((_, j) => j !== i))}
                  className="text-muted hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setFonts((arr) => [...arr, { name: "", url: "" }])}
            >
              <Plus size={14} /> Fonte
            </Button>
          </div>
        </Field>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-semibold">Direção criativa</h3>
        <Field label="Prompt base do cliente" hint="Direção criativa fixa, sempre incluída nas gerações.">
          <Textarea
            value={basePrompt}
            onChange={(e) => setBasePrompt(e.target.value)}
            placeholder="Ex: estética minimalista, fotografia natural, tons quentes..."
          />
        </Field>
        <Field label="Estilo visual">
          <Textarea
            value={styleDescription}
            onChange={(e) => setStyleDescription(e.target.value)}
            placeholder="Descreva o estilo da marca."
          />
        </Field>
        <Field label="Regras visuais">
          <Textarea
            value={visualRules}
            onChange={(e) => setVisualRules(e.target.value)}
            placeholder="Ex: sempre usar muito espaço em branco, evitar gradientes..."
          />
        </Field>
        <Field label="Restrições (NUNCA fazer)">
          <Textarea
            value={restrictions}
            onChange={(e) => setRestrictions(e.target.value)}
            placeholder="Ex: não usar a cor vermelha, não usar pessoas..."
          />
        </Field>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-semibold">Imagens de referência</h3>
        <div className="flex flex-wrap gap-3">
          {refs.map((url, i) => (
            <div
              key={i}
              className="relative h-24 w-24 overflow-hidden rounded-lg border border-border bg-background"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="ref" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setRefs((arr) => arr.filter((_, j) => j !== i))}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-muted hover:bg-background">
            <Plus size={20} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  const url = await uploadFile(f);
                  setRefs((arr) => [...arr, url]);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Erro no upload");
                }
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </Card>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-3">
        <Button onClick={submit} disabled={pending || !name.trim()}>
          {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar cliente"}
        </Button>
        <Button variant="secondary" onClick={() => router.back()} disabled={pending}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
