"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Handshake,
  MapPin,
  Megaphone,
  MessageCircle,
  Monitor,
  PenLine,
  Printer,
  Sparkles,
  Store,
  TrendingUp,
  Tv,
} from "lucide-react";
import { Button, Field, Input, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";

const ASSETS = {
  facade: "/presentation-assets/star-mall/mall-facade.jpg",
  corridor: "/presentation-assets/star-mall/mall-corridor-totem.jpg",
  easter: "/presentation-assets/star-mall/easter-activation.jpg",
  workshop: "/presentation-assets/star-mall/kids-workshop.jpg",
  community: "/presentation-assets/star-mall/community-action.jpg",
  entrance: "/presentation-assets/star-mall/entrance-signage.jpg",
};

const SLIDES = [
  { id: "cover", label: "Capa" },
  { id: "opportunity", label: "Oportunidade" },
  { id: "channels", label: "Canais" },
  { id: "services", label: "Serviços" },
  { id: "routine", label: "Rotina" },
  { id: "calendar", label: "Calendário" },
  { id: "activations", label: "Ativações" },
  { id: "retail", label: "Lojistas" },
  { id: "governance", label: "Indicadores" },
  { id: "next", label: "Próximos passos" },
] as const;

type SlideId = (typeof SLIDES)[number]["id"];
type Tone = "executivo" | "varejo" | "institucional";

const TONE_COPY: Record<Tone, { label: string; positioning: string; promise: string }> = {
  executivo: {
    label: "Executivo",
    positioning: "gestão de comunicação, marketing e relacionamento para um mall de vizinhança",
    promise: "transformar presença local em fluxo qualificado, reputação e valor para lojistas",
  },
  varejo: {
    label: "Varejo local",
    positioning: "rotina comercial para aproximar lojas, moradores e visitantes do entorno",
    promise: "fazer o Star Mall aparecer todos os dias onde o cliente decide comprar",
  },
  institucional: {
    label: "Institucional",
    positioning: "plano de comunicação para fortalecer marca, governança e presença regional",
    promise: "organizar canais, padronizar mensagens e ampliar relacionamento com a comunidade",
  },
};

const CHANNELS = [
  { icon: Megaphone, title: "Redes sociais", text: "posts, stories, reels, fotos reais e campanhas por loja" },
  { icon: MessageCircle, title: "WhatsApp", text: "canal de novidades, atendimento e ativações com base LGPD" },
  { icon: Monitor, title: "Website", text: "vitrine institucional, mix de lojas, promoções e cadastro" },
  { icon: MapPin, title: "Google", text: "respostas em tempo real, reputação e presença em busca local" },
  { icon: Tv, title: "Mídias internas", text: "TVs, totens, elevadores, cartazes e sinalização de fluxo" },
  { icon: Handshake, title: "Bairro e parceiros", text: "condomínios, influenciadores, mídia local e grupos da região" },
];

const SERVICES = [
  "Identidade visual e padronização de comunicação",
  "Calendário anual de campanhas e ações comerciais",
  "Produção semanal de fotos e vídeos reais no mall",
  "Gestão de redes sociais, stories e campanhas digitais",
  "Relacionamento com lojistas, imprensa local e influenciadores",
  "Website, cadastro LGPD, WhatsApp, Google e atendimento digital",
  "Comunicação visual, totens, sinalização e oportunidades de mídia",
  "Relatórios mensais com indicadores e plano de evolução",
];

const ROUTINE = [
  { k: "1x", v: "sessão semanal de fotos, vídeos e captação por loja" },
  { k: "8-12", v: "posts mensais com foco em mix, serviços e campanhas" },
  { k: "20-30", v: "stories mensais com bastidores, ofertas e relacionamento" },
  { k: "24h", v: "monitoramento de mensagens, Google e canais digitais" },
  { k: "1", v: "relatório mensal de presença, entregas e próximos movimentos" },
];

const MONTHS = [
  "Volta às aulas",
  "Carnaval de ofertas",
  "Mulher e consumidor",
  "Páscoa",
  "Dia das Mães",
  "Namorados",
  "Férias",
  "Pais",
  "Semana do Cliente",
  "Crianças",
  "Black Week",
  "Natal",
];

export function CommercialPresentationBuilder() {
  const [clientName, setClientName] = useState("Star Mall");
  const [subtitle, setSubtitle] = useState(
    "Apresentação comercial de comunicação, marketing e relacionamento",
  );
  const [objective, setObjective] = useState(
    "Criar uma presença mais forte, organizada e constante para o Star Mall, valorizando lojistas, atraindo clientes do entorno e estruturando canais comerciais para campanhas, serviços e parcerias.",
  );
  const [tone, setTone] = useState<Tone>("executivo");
  const [enabled, setEnabled] = useState<Record<SlideId, boolean>>(
    () => Object.fromEntries(SLIDES.map((slide) => [slide.id, true])) as Record<SlideId, boolean>,
  );

  const activeSlides = useMemo(
    () => SLIDES.filter((slide) => enabled[slide.id]),
    [enabled],
  );
  const copy = TONE_COPY[tone];

  function toggleSlide(id: SlideId) {
    setEnabled((current) => ({ ...current, [id]: !current[id] }));
  }

  function printPdf() {
    window.print();
  }

  return (
    <div className="space-y-6">
      <div className="presentation-screen-title flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-[#d8ded7] bg-white px-3 py-1 text-xs font-semibold uppercase text-[#486155]">
            <Sparkles size={14} />
            Gerador comercial
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Apresentações</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Base visual premium para propostas comerciais, com a primeira versão pronta para o Star Mall.
          </p>
        </div>
        <div className="presentation-toolbar flex flex-wrap gap-2">
          <Button variant="secondary" onClick={printPdf}>
            <Printer size={16} /> Imprimir
          </Button>
          <Button onClick={printPdf}>
            <Download size={16} /> Exportar PDF
          </Button>
        </div>
      </div>

      <div className="presentation-shell grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="presentation-editor h-max rounded-lg border border-[#d8ded7] bg-white p-4 shadow-sm xl:sticky xl:top-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Briefing</p>
              <p className="text-xs text-muted">{activeSlides.length} slides ativos</p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#163c32] text-white">
              <FileText size={17} />
            </span>
          </div>

          <div className="space-y-4">
            <Field label="Cliente">
              <Input value={clientName} onChange={(event) => setClientName(event.target.value)} />
            </Field>
            <Field label="Subtítulo">
              <Input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} />
            </Field>
            <Field label="Objetivo comercial">
              <Textarea
                className="min-h-32"
                value={objective}
                onChange={(event) => setObjective(event.target.value)}
              />
            </Field>

            <div>
              <p className="mb-2 text-sm font-medium">Narrativa</p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(TONE_COPY) as Tone[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={tone === item}
                    onClick={() => setTone(item)}
                    className={cn(
                      "h-10 rounded-lg border px-2 text-xs font-semibold transition-colors",
                      tone === item
                        ? "border-[#163c32] bg-[#163c32] text-white"
                        : "border-border bg-surface text-foreground hover:bg-background",
                    )}
                  >
                    {TONE_COPY[item].label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Seções</p>
              <div className="space-y-1">
                {SLIDES.map((slide) => (
                  <label
                    key={slide.id}
                    className="flex h-10 cursor-pointer items-center justify-between rounded-lg border border-transparent px-2 text-sm hover:border-border hover:bg-background"
                  >
                    <span>{slide.label}</span>
                    <input
                      type="checkbox"
                      checked={enabled[slide.id]}
                      onChange={() => toggleSlide(slide.id)}
                      className="h-4 w-4 accent-[#163c32]"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#486155]">
            <Eye size={16} />
            Preview 16:9
          </div>
          <div className="deck-preview presentation-print-root space-y-5">
            {activeSlides.map((slide, index) => (
              <SlideById
                key={slide.id}
                id={slide.id}
                index={index + 1}
                total={activeSlides.length}
                clientName={clientName || "Star Mall"}
                subtitle={subtitle}
                objective={objective}
                copy={copy}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function SlideById({
  id,
  index,
  total,
  clientName,
  subtitle,
  objective,
  copy,
}: {
  id: SlideId;
  index: number;
  total: number;
  clientName: string;
  subtitle: string;
  objective: string;
  copy: (typeof TONE_COPY)[Tone];
}) {
  switch (id) {
    case "cover":
      return <CoverSlide index={index} total={total} clientName={clientName} subtitle={subtitle} copy={copy} />;
    case "opportunity":
      return <OpportunitySlide index={index} total={total} clientName={clientName} objective={objective} copy={copy} />;
    case "channels":
      return <ChannelsSlide index={index} total={total} clientName={clientName} />;
    case "services":
      return <ServicesSlide index={index} total={total} clientName={clientName} />;
    case "routine":
      return <RoutineSlide index={index} total={total} clientName={clientName} />;
    case "calendar":
      return <CalendarSlide index={index} total={total} clientName={clientName} />;
    case "activations":
      return <ActivationsSlide index={index} total={total} clientName={clientName} />;
    case "retail":
      return <RetailSlide index={index} total={total} clientName={clientName} />;
    case "governance":
      return <GovernanceSlide index={index} total={total} clientName={clientName} />;
    case "next":
      return <NextStepsSlide index={index} total={total} clientName={clientName} copy={copy} />;
  }
}

function SlideFrame({
  children,
  className,
  index,
  total,
  inverted = false,
}: {
  children: React.ReactNode;
  className?: string;
  index: number;
  total: number;
  inverted?: boolean;
}) {
  return (
    <section
      className={cn(
        "commercial-slide relative overflow-hidden rounded-lg border border-[#d8ded7] shadow-sm",
        className,
      )}
    >
      {children}
      <div
        className={cn(
          "absolute bottom-5 left-7 right-7 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]",
          inverted ? "text-white/65" : "text-[#486155]",
        )}
      >
        <span>elephant.</span>
        <span>
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}

function Photo({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1280px) 90vw, 900px"
        className="object-cover"
      />
    </div>
  );
}

function CoverSlide({
  index,
  total,
  clientName,
  subtitle,
  copy,
}: {
  index: number;
  total: number;
  clientName: string;
  subtitle: string;
  copy: (typeof TONE_COPY)[Tone];
}) {
  return (
    <SlideFrame index={index} total={total} inverted className="slide-dark text-white">
      <div className="grid h-full grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center px-12 pb-12 pt-10">
          <div className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#f4b95f]">
            <PresentationMark />
            Proposta comercial
          </div>
          <h2 className="max-w-[520px] text-6xl font-semibold leading-none tracking-tight">{clientName}</h2>
          <p className="mt-5 max-w-[520px] text-xl leading-snug text-white/82">{subtitle}</p>
          <div className="mt-10 grid grid-cols-2 gap-3 text-sm">
            <MetricPill label="Foco" value={copy.positioning} />
            <MetricPill label="Promessa" value={copy.promise} />
          </div>
        </div>
        <div className="relative">
          <Image
            src={ASSETS.facade}
            alt="Fachada usada como referência visual de mall"
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#111711]/20" />
          <div className="absolute bottom-10 left-8 right-8 rounded-lg border border-white/25 bg-white/12 p-4 text-sm backdrop-blur">
            Base visual curada a partir de execuções reais em mall de perfil semelhante.
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

function OpportunitySlide({
  index,
  total,
  clientName,
  objective,
  copy,
}: {
  index: number;
  total: number;
  clientName: string;
  objective: string;
  copy: (typeof TONE_COPY)[Tone];
}) {
  const problems = [
    "canais dispersos e pouco integrados",
    "lojas sem protagonismo na comunicação",
    "calendário de campanhas reativo",
    "respostas e reputação digital sem rotina",
    "potencial local pouco explorado",
  ];

  return (
    <SlideFrame index={index} total={total}>
      <div className="grid h-full grid-cols-[0.95fr_1.05fr] gap-8 px-11 pb-14 pt-10">
        <div className="flex flex-col justify-between">
          <div>
            <SlideKicker>Oportunidade</SlideKicker>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#16231c]">
              O {clientName} pode operar como marca, mídia e ponto de encontro do entorno.
            </h2>
          </div>
          <div className="rounded-lg bg-[#163c32] p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4b95f]">Objetivo</p>
            <p className="mt-3 text-lg leading-snug">{objective}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {problems.map((item, itemIndex) => (
            <div key={item} className="rounded-lg border border-[#d8ded7] bg-white p-4">
              <span className="text-sm font-semibold text-[#d06045]">0{itemIndex + 1}</span>
              <p className="mt-4 text-xl font-semibold leading-tight text-[#16231c]">{item}</p>
            </div>
          ))}
          <div className="rounded-lg bg-[#f4b95f] p-4 text-[#16231c]">
            <TrendingUp size={22} />
            <p className="mt-4 text-xl font-semibold leading-tight">{copy.promise}.</p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

function ChannelsSlide({ index, total, clientName }: { index: number; total: number; clientName: string }) {
  return (
    <SlideFrame index={index} total={total} className="slide-white">
      <div className="h-full px-11 pb-14 pt-10">
        <div className="flex items-start justify-between gap-8">
          <div>
            <SlideKicker>Ecossistema</SlideKicker>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-[#16231c]">
              Onde a comunicação do {clientName} precisa chegar.
            </h2>
          </div>
          <div className="w-56 rounded-lg border border-[#d8ded7] p-4 text-sm text-[#486155]">
            A proposta integra canais digitais, mídia física, lojistas, bairro e atendimento.
          </div>
        </div>
        <div className="mt-7 grid grid-cols-3 gap-3">
          {CHANNELS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="min-h-32 rounded-lg border border-[#d8ded7] bg-[#f8faf7] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#163c32] text-white">
                <Icon size={19} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#16231c]">{title}</h3>
              <p className="mt-2 text-sm leading-snug text-[#486155]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

function ServicesSlide({ index, total, clientName }: { index: number; total: number; clientName: string }) {
  return (
    <SlideFrame index={index} total={total} className="slide-deep text-white" inverted>
      <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-8 px-11 pb-14 pt-10">
        <div className="flex flex-col justify-between">
          <div>
            <SlideKicker dark>Serviços</SlideKicker>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Um escopo completo para posicionar o {clientName} no dia a dia do cliente local.
            </h2>
          </div>
          <Photo src={ASSETS.corridor} alt="Corredor com totem de comunicação" className="h-56" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SERVICES.map((service) => (
            <div key={service} className="rounded-lg border border-white/14 bg-white/8 p-4">
              <Check className="text-[#f4b95f]" size={18} />
              <p className="mt-4 text-lg font-semibold leading-tight">{service}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

function RoutineSlide({ index, total, clientName }: { index: number; total: number; clientName: string }) {
  return (
    <SlideFrame index={index} total={total}>
      <div className="grid h-full grid-cols-[1fr_0.95fr] gap-7 px-11 pb-14 pt-10">
        <div>
          <SlideKicker>Operação mensal</SlideKicker>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#16231c]">
            Ritmo constante, com entregas visíveis para clientes, lojistas e administração.
          </h2>
          <div className="mt-7 space-y-3">
            {ROUTINE.map((item) => (
              <div key={item.v} className="grid grid-cols-[86px_1fr] items-center gap-4 rounded-lg border border-[#d8ded7] bg-white p-3">
                <span className="text-3xl font-semibold text-[#d06045]">{item.k}</span>
                <p className="text-base font-medium leading-snug text-[#16231c]">{item.v}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Photo src={ASSETS.entrance} alt="Entrada com sinalização do mall" className="min-h-0 flex-1" />
          <div className="rounded-lg bg-[#f4b95f] p-5 text-[#16231c]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em]">Resultado esperado</p>
            <p className="mt-3 text-2xl font-semibold leading-tight">
              O {clientName} deixa de aparecer apenas em campanhas e passa a ser lembrado toda semana.
            </p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

function CalendarSlide({ index, total, clientName }: { index: number; total: number; clientName: string }) {
  return (
    <SlideFrame index={index} total={total} className="slide-white">
      <div className="h-full px-11 pb-14 pt-10">
        <div className="flex items-start justify-between">
          <div>
            <SlideKicker>Calendário comercial</SlideKicker>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#16231c]">
              Datas viram campanhas, experiências e pauta para lojistas.
            </h2>
          </div>
          <CalendarDays className="text-[#d06045]" size={38} />
        </div>
        <div className="mt-8 grid grid-cols-4 gap-3">
          {MONTHS.map((month, idx) => (
            <div key={month} className="rounded-lg border border-[#d8ded7] bg-[#f8faf7] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#486155]">
                {String(idx + 1).padStart(2, "0")}
              </p>
              <p className="mt-5 text-xl font-semibold leading-tight text-[#16231c]">{month}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg bg-[#163c32] px-5 py-4 text-white">
          <p className="text-lg font-semibold">
            Para o {clientName}: planejamento aprovado com antecedência, pauta por loja e ativações compatíveis com orçamento.
          </p>
        </div>
      </div>
    </SlideFrame>
  );
}

function ActivationsSlide({ index, total, clientName }: { index: number; total: number; clientName: string }) {
  return (
    <SlideFrame index={index} total={total}>
      <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-7 px-11 pb-14 pt-10">
        <div className="flex flex-col justify-between">
          <div>
            <SlideKicker>Experiências</SlideKicker>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#16231c]">
              Ações simples, bem executadas e fotografáveis criam vínculo com o público.
            </h2>
            <p className="mt-5 text-lg leading-snug text-[#486155]">
              Oficinas, brindes, cenários, campanhas solidárias e encontros com influenciadores dão material real para todos os canais.
            </p>
          </div>
          <div className="rounded-lg border border-[#d8ded7] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d06045]">Curadoria</p>
            <p className="mt-3 text-xl font-semibold leading-tight text-[#16231c]">
              Para o {clientName}, cada ação já nasce com roteiro de comunicação, captação e pós-campanha.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Photo src={ASSETS.easter} alt="Cenário temático de Páscoa" className="row-span-2" />
          <Photo src={ASSETS.workshop} alt="Oficina infantil em ação promocional" />
          <Photo src={ASSETS.community} alt="Ação de relacionamento com comunidade" />
        </div>
      </div>
    </SlideFrame>
  );
}

function RetailSlide({ index, total, clientName }: { index: number; total: number; clientName: string }) {
  const items = [
    "destaques por loja, categoria e serviço",
    "captação de produtos, bastidores e vitrines",
    "kits de mídia para campanhas e parcerias",
    "conteúdos para site, WhatsApp, Google e social",
  ];

  return (
    <SlideFrame index={index} total={total} className="slide-white">
      <div className="grid h-full grid-cols-[1fr_0.9fr] gap-8 px-11 pb-14 pt-10">
        <div>
          <SlideKicker>Lojistas</SlideKicker>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#16231c]">
            O mix do {clientName} precisa aparecer como produto editorial e comercial.
          </h2>
          <div className="mt-7 grid grid-cols-2 gap-3">
            {items.map((item) => (
              <div key={item} className="rounded-lg border border-[#d8ded7] bg-[#f8faf7] p-4">
                <Store className="text-[#d06045]" size={20} />
                <p className="mt-5 text-xl font-semibold leading-tight text-[#16231c]">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Photo src={ASSETS.corridor} alt="Totem de divulgação em corredor de lojas" className="min-h-0 flex-1" />
          <div className="rounded-lg bg-[#16231c] p-5 text-white">
            <p className="text-2xl font-semibold leading-tight">Mais visibilidade para lojas. Mais motivos para visitar.</p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

function GovernanceSlide({ index, total, clientName }: { index: number; total: number; clientName: string }) {
  const metrics = [
    "alcance geolocalizado",
    "visualizações e engajamento",
    "crescimento da base",
    "cadastros LGPD",
    "avaliações e respostas Google",
    "participação dos lojistas",
  ];

  return (
    <SlideFrame index={index} total={total}>
      <div className="h-full px-11 pb-14 pt-10">
        <SlideKicker>Governança</SlideKicker>
        <div className="mt-4 grid grid-cols-[1fr_0.8fr] gap-8">
          <h2 className="text-4xl font-semibold leading-tight text-[#16231c]">
            A comunicação do {clientName} deve ser acompanhada por rotina, dados e decisões claras.
          </h2>
          <div className="rounded-lg bg-[#f4b95f] p-5 text-[#16231c]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Relatório mensal</p>
            <p className="mt-3 text-2xl font-semibold leading-tight">
              Entregas, aprendizados, próximos testes e recomendações para o calendário.
            </p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3">
          {metrics.map((metric, idx) => (
            <div key={metric} className="rounded-lg border border-[#d8ded7] bg-white p-4">
              <p className="text-3xl font-semibold text-[#163c32]">{idx + 1}</p>
              <p className="mt-5 text-lg font-semibold leading-tight text-[#16231c]">{metric}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

function NextStepsSlide({
  index,
  total,
  clientName,
  copy,
}: {
  index: number;
  total: number;
  clientName: string;
  copy: (typeof TONE_COPY)[Tone];
}) {
  const steps = [
    "diagnóstico de canais, ativos e oportunidades comerciais",
    "definição de identidade, tom e calendário dos próximos 90 dias",
    "captação inicial de fotos, vídeos, lojas e serviços prioritários",
    "implantação da rotina de conteúdo, atendimento e campanhas",
    "primeiro relatório com ajustes, prioridades e plano de escala",
  ];

  return (
    <SlideFrame index={index} total={total} inverted className="slide-dark text-white">
      <div className="grid h-full grid-cols-[0.95fr_1.05fr] gap-8 px-11 pb-14 pt-10">
        <div className="flex flex-col justify-between">
          <div>
            <SlideKicker dark>Próximos passos</SlideKicker>
            <h2 className="mt-4 text-5xl font-semibold leading-none">
              Vamos transformar o {clientName} em referência local.
            </h2>
            <p className="mt-6 text-xl leading-snug text-white/78">{copy.promise}.</p>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/8 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4b95f]">Entrega inicial sugerida</p>
            <p className="mt-3 text-2xl font-semibold">Plano de 90 dias + apresentação comercial pronta para PDF.</p>
          </div>
        </div>
        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center gap-4 rounded-lg border border-white/14 bg-white/8 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f4b95f] text-sm font-bold text-[#16231c]">
                {idx + 1}
              </span>
              <p className="text-lg font-semibold leading-snug">{step}</p>
              <ChevronRight className="ml-auto text-white/45" size={18} />
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

function SlideKicker({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.24em]",
        dark ? "text-[#f4b95f]" : "text-[#d06045]",
      )}
    >
      {children}
    </p>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/8 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f4b95f]">{label}</p>
      <p className="mt-2 leading-snug text-white/85">{value}</p>
    </div>
  );
}

function PresentationMark() {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#f4b95f]/45">
      <PenLine size={16} />
    </span>
  );
}
