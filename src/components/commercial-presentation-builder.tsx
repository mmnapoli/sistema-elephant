"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarDays,
  Check,
  Download,
  Eye,
  FileText,
  MapPin,
  Megaphone,
  PenLine,
  Printer,
  Sparkles,
  Store,
  Tv,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

const PAGES = [
  { id: "cover", label: "Capa" },
  { id: "context", label: "Contexto" },
  { id: "method", label: "Metodo" },
  { id: "scope", label: "Escopo" },
  { id: "calendar", label: "Calendario" },
  { id: "governance", label: "Governanca" },
  { id: "next", label: "Proximos passos" },
] as const;

type PageId = (typeof PAGES)[number]["id"];

const SCOPE = [
  {
    icon: Megaphone,
    title: "Social e conteudo",
    text: "Planejamento editorial, posts, stories, reels, fotos reais e cobertura das campanhas do mall.",
  },
  {
    icon: Tv,
    title: "Midia interna",
    text: "Pecas para TVs, totens, cartazes, sinalizacao, vitrines digitais e comunicacao de fluxo.",
  },
  {
    icon: Store,
    title: "Lojistas",
    text: "Rotina de relacionamento, destaque por loja, captacao de ofertas e calendario integrado.",
  },
  {
    icon: MapPin,
    title: "Busca local",
    text: "Google, reputacao, respostas, presenca regional e consistencia das informacoes publicas.",
  },
];

const SERVICES = [
  "Diagnostico de canais, posicionamento e oportunidades comerciais",
  "Padrao visual de campanhas, pecas e mensagens institucionais",
  "Calendario mensal com datas, acoes, lojas prioritarias e canais",
  "Captacao recorrente de fotos, videos, vitrines, produtos e bastidores",
  "Gestao de redes sociais, Google, WhatsApp e conteudos de relacionamento",
  "Campanhas sazonais com roteiro, ativacao, divulgacao e pos-campanha",
  "Relatorio executivo com indicadores, entregas, aprendizados e proximos ajustes",
];

const CALENDAR = [
  "Diagnostico",
  "Identidade",
  "Calendario",
  "Captacao",
  "Campanhas",
  "Lojistas",
  "Relatorio",
  "Evolucao",
];

const METRICS = [
  "alcance local",
  "engajamento",
  "base de contatos",
  "reputacao Google",
  "adesao dos lojistas",
  "campanhas publicadas",
];

export function CommercialPresentationBuilder() {
  const [clientName, setClientName] = useState("Star Mall");
  const [clientSegment, setClientSegment] = useState("shopping de conveniencia e mall de vizinhanca");
  const [location, setLocation] = useState("Grande Sao Paulo");
  const [period, setPeriod] = useState("2026");
  const [contactName, setContactName] = useState("Equipe Elephant");
  const [headline, setHeadline] = useState(
    "Comunicacao, marketing e relacionamento para transformar presenca local em fluxo qualificado.",
  );
  const [objective, setObjective] = useState(
    "Criar uma rotina comercial mais forte para o Star Mall, valorizando lojistas, ampliando a presenca digital e organizando campanhas que aproximem o mall do publico do entorno.",
  );
  const [investmentNote, setInvestmentNote] = useState(
    "Apos validacao do escopo, a Elephant estrutura uma proposta com fases, entregas mensais, investimento e cronograma de implantacao.",
  );
  const [enabled, setEnabled] = useState<Record<PageId, boolean>>(
    () => Object.fromEntries(PAGES.map((page) => [page.id, true])) as Record<PageId, boolean>,
  );

  const activePages = useMemo(() => PAGES.filter((page) => enabled[page.id]), [enabled]);

  function togglePage(id: PageId) {
    setEnabled((current) => ({ ...current, [id]: !current[id] }));
  }

  function printPdf() {
    window.print();
  }

  return (
    <div className="space-y-6">
      <div className="presentation-screen-title flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-[#dedbd2] bg-white px-3 py-1 text-xs font-semibold uppercase text-[#5d5548]">
            <Sparkles size={14} />
            Template A4 comercial
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Apresentacoes</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Base padrao Elephant para proposta comercial, pronta para ajustar cliente, contexto e escopo antes de exportar em PDF.
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

      <div className="presentation-shell grid gap-5 2xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="presentation-editor h-max rounded-md border border-[#dedbd2] bg-white p-4 shadow-sm 2xl:sticky 2xl:top-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Dados do template</p>
              <p className="text-xs text-muted">{activePages.length} paginas A4 ativas</p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#241c2f] text-white">
              <FileText size={17} />
            </span>
          </div>

          <div className="space-y-4">
            <Field label="Cliente">
              <Input value={clientName} onChange={(event) => setClientName(event.target.value)} />
            </Field>
            <Field label="Segmento">
              <Input value={clientSegment} onChange={(event) => setClientSegment(event.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Praca">
                <Input value={location} onChange={(event) => setLocation(event.target.value)} />
              </Field>
              <Field label="Periodo">
                <Input value={period} onChange={(event) => setPeriod(event.target.value)} />
              </Field>
            </div>
            <Field label="Responsavel">
              <Input value={contactName} onChange={(event) => setContactName(event.target.value)} />
            </Field>
            <Field label="Chamada da capa">
              <Textarea className="min-h-24" value={headline} onChange={(event) => setHeadline(event.target.value)} />
            </Field>
            <Field label="Objetivo comercial">
              <Textarea
                className="min-h-32"
                value={objective}
                onChange={(event) => setObjective(event.target.value)}
              />
            </Field>
            <Field label="Nota de proposta">
              <Textarea
                className="min-h-24"
                value={investmentNote}
                onChange={(event) => setInvestmentNote(event.target.value)}
              />
            </Field>

            <div>
              <p className="mb-2 text-sm font-medium">Paginas</p>
              <div className="space-y-1">
                {PAGES.map((page) => (
                  <label
                    key={page.id}
                    className="flex h-10 cursor-pointer items-center justify-between rounded-md border border-transparent px-2 text-sm hover:border-border hover:bg-background"
                  >
                    <span>{page.label}</span>
                    <input
                      type="checkbox"
                      checked={enabled[page.id]}
                      onChange={() => togglePage(page.id)}
                      className="h-4 w-4 accent-[#6d28d9]"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#5d5548]">
            <Eye size={16} />
            Preview A4 vertical
          </div>
          <div className="deck-preview presentation-print-root space-y-6">
            {activePages.map((page, index) => (
              <PageById
                key={page.id}
                id={page.id}
                index={index + 1}
                total={activePages.length}
                clientName={clientName || "Star Mall"}
                clientSegment={clientSegment}
                location={location}
                period={period}
                contactName={contactName}
                headline={headline}
                objective={objective}
                investmentNote={investmentNote}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function PageById({
  id,
  index,
  total,
  clientName,
  clientSegment,
  location,
  period,
  contactName,
  headline,
  objective,
  investmentNote,
}: {
  id: PageId;
  index: number;
  total: number;
  clientName: string;
  clientSegment: string;
  location: string;
  period: string;
  contactName: string;
  headline: string;
  objective: string;
  investmentNote: string;
}) {
  const shared = { index, total, clientName, clientSegment, location, period, contactName };

  switch (id) {
    case "cover":
      return <CoverPage {...shared} headline={headline} />;
    case "context":
      return <ContextPage {...shared} objective={objective} />;
    case "method":
      return <MethodPage {...shared} />;
    case "scope":
      return <ScopePage {...shared} />;
    case "calendar":
      return <CalendarPage {...shared} />;
    case "governance":
      return <GovernancePage {...shared} />;
    case "next":
      return <NextPage {...shared} investmentNote={investmentNote} />;
  }
}

function DocumentPage({
  children,
  index,
  total,
  dark = false,
  className,
}: {
  children: ReactNode;
  index: number;
  total: number;
  dark?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "commercial-slide relative overflow-hidden rounded-md border border-[#dedbd2] bg-[#f7f3ea] shadow-sm",
        dark && "bg-[#17131f] text-white",
        className,
      )}
    >
      {children}
      <footer
        className={cn(
          "absolute bottom-8 left-9 right-9 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]",
          dark ? "text-white/55" : "text-[#6b6256]",
        )}
      >
        <ElephantBrand compact inverted={dark} />
        <span>
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </footer>
    </section>
  );
}

function CoverPage({
  index,
  total,
  clientName,
  clientSegment,
  location,
  period,
  contactName,
  headline,
}: SharedPageProps & { headline: string }) {
  return (
    <DocumentPage index={index} total={total} dark>
      <div className="absolute inset-x-0 top-0 h-[45%]">
        <Image
          src={ASSETS.facade}
          alt="Fachada de mall usada como referencia visual"
          fill
          priority
          sizes="820px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#17131f]/35" />
      </div>

      <div className="relative flex h-full flex-col px-9 pb-20 pt-9">
        <div className="flex items-center justify-between">
          <ElephantBrand inverted />
          <div className="rounded-md border border-white/20 px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
            Proposta comercial
            <br />
            {period}
          </div>
        </div>

        <div className="mt-auto grid gap-5">
          <div className="w-max rounded-md bg-[#f4b95f] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1d1727]">
            {clientSegment}
          </div>
          <h2 className="max-w-[650px] text-[68px] font-semibold leading-[0.92] tracking-tight">
            {clientName}
          </h2>
          <p className="max-w-[610px] text-[25px] leading-tight text-white/84">{headline}</p>
          <div className="grid grid-cols-3 gap-3 pt-5">
            <CoverInfo icon={MapPin} label="Praca" value={location} />
            <CoverInfo icon={CalendarDays} label="Periodo" value={period} />
            <CoverInfo icon={PenLine} label="Responsavel" value={contactName} />
          </div>
        </div>
      </div>
    </DocumentPage>
  );
}

function ContextPage({ index, total, clientName, clientSegment, objective }: SharedPageProps & { objective: string }) {
  const points = [
    "O mall precisa ser lembrado antes da visita, durante a decisao de compra e depois da experiencia.",
    "Lojistas ganham valor quando aparecem em uma narrativa consistente, e nao apenas como ofertas isoladas.",
    "O entorno deve reconhecer o empreendimento como ponto util, proximo e recorrente.",
  ];

  return (
    <DocumentPage index={index} total={total}>
      <PageHeader eyebrow="Contexto comercial" title={`O ${clientName} tem potencial para operar como marca de bairro.`} />

      <div className="grid grid-cols-[1fr_0.72fr] gap-5 px-9">
        <div className="space-y-5">
          <div className="rounded-md bg-white p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d06045]">Objetivo</p>
            <p className="mt-4 text-[25px] font-semibold leading-tight text-[#1f2430]">{objective}</p>
          </div>

          <div className="grid gap-3">
            {points.map((point, itemIndex) => (
              <div key={point} className="grid grid-cols-[46px_1fr] gap-4 rounded-md border border-[#dedbd2] bg-[#fffaf0] p-4">
                <span className="text-[28px] font-semibold text-[#6d28d9]">{itemIndex + 1}</span>
                <p className="text-[18px] font-semibold leading-snug text-[#292331]">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Photo src={ASSETS.entrance} alt="Entrada e sinalizacao do mall" className="h-[365px]" />
          <div className="rounded-md bg-[#241c2f] p-5 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f4b95f]">Leitura Elephant</p>
            <p className="mt-3 text-[24px] font-semibold leading-tight">
              Para um {clientSegment}, rotina e proximidade valem tanto quanto campanhas grandes.
            </p>
          </div>
        </div>
      </div>
    </DocumentPage>
  );
}

function MethodPage({ index, total, clientName }: SharedPageProps) {
  const steps = [
    ["01", "Organizar", "canais, mensagens, identidade e prioridades comerciais"],
    ["02", "Produzir", "fotos, videos, pecas, campanhas e conteudos de loja"],
    ["03", "Distribuir", "social, Google, WhatsApp, midias internas e parceiros locais"],
    ["04", "Medir", "entregas, dados, adesao dos lojistas e proximas oportunidades"],
  ];

  return (
    <DocumentPage index={index} total={total} className="bg-white">
      <PageHeader eyebrow="Metodo Elephant" title="Um sistema simples para manter o mall vivo todos os meses." />

      <div className="px-9">
        <div className="relative h-[265px] overflow-hidden rounded-md">
          <Image src={ASSETS.corridor} alt="Corredor com ponto de comunicacao" fill sizes="820px" className="object-cover" />
          <div className="absolute inset-0 bg-[#17131f]/25" />
          <div className="absolute bottom-5 left-5 max-w-[360px] rounded-md bg-white/92 p-4">
            <p className="text-[22px] font-semibold leading-tight text-[#241c2f]">
              A proposta nao e apenas postar: e criar uma cadencia comercial para o {clientName}.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {steps.map(([number, title, text]) => (
            <div key={number} className="rounded-md border border-[#dedbd2] bg-[#f7f3ea] p-5">
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#d06045]">{number}</p>
              <h3 className="mt-5 text-[29px] font-semibold leading-none text-[#241c2f]">{title}</h3>
              <p className="mt-3 text-[17px] font-medium leading-snug text-[#5d5548]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </DocumentPage>
  );
}

function ScopePage({ index, total, clientName }: SharedPageProps) {
  return (
    <DocumentPage index={index} total={total} dark>
      <PageHeader dark eyebrow="Escopo base" title={`O que a Elephant pode operar para o ${clientName}.`} />

      <div className="grid grid-cols-[0.78fr_1fr] gap-5 px-9">
        <div className="space-y-3">
          {SCOPE.map(({ icon: Icon, title, text }) => (
            <IconBlock key={title} icon={Icon} title={title} text={text} />
          ))}
        </div>
        <div className="rounded-md border border-white/12 bg-white/[0.06] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f4b95f]">Entregas sugeridas</p>
          <div className="mt-5 space-y-3">
            {SERVICES.map((service) => (
              <div key={service} className="grid grid-cols-[24px_1fr] gap-3 border-b border-white/10 pb-3 last:border-0">
                <Check size={18} className="mt-1 text-[#f4b95f]" />
                <p className="text-[17px] font-semibold leading-snug text-white/86">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DocumentPage>
  );
}

function CalendarPage({ index, total, clientName, period }: SharedPageProps) {
  return (
    <DocumentPage index={index} total={total}>
      <PageHeader eyebrow="Plano de implantacao" title={`Primeiros 90 dias para dar forma a comunicacao do ${clientName}.`} />

      <div className="px-9">
        <div className="grid grid-cols-4 gap-3">
          {CALENDAR.map((item, itemIndex) => (
            <div key={item} className="min-h-[132px] rounded-md border border-[#dedbd2] bg-white p-4">
              <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#6d28d9]">
                {String(itemIndex + 1).padStart(2, "0")}
              </span>
              <p className="mt-8 text-[21px] font-semibold leading-tight text-[#241c2f]">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-[1fr_0.72fr] gap-5">
          <div className="rounded-md bg-[#f4b95f] p-6 text-[#241c2f]">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Ritmo mensal</p>
            <p className="mt-4 text-[31px] font-semibold leading-tight">
              Planejamento aprovado, captacao em campo, campanhas publicadas e fechamento com relatorio executivo.
            </p>
          </div>
          <div className="rounded-md bg-[#241c2f] p-6 text-white">
            <CalendarDays size={34} className="text-[#f4b95f]" />
            <p className="mt-8 text-[22px] font-semibold leading-tight">
              Calendario {period} preparado para datas de varejo, ativações simples e oportunidades dos lojistas.
            </p>
          </div>
        </div>
      </div>
    </DocumentPage>
  );
}

function GovernancePage({ index, total, clientName }: SharedPageProps) {
  return (
    <DocumentPage index={index} total={total} className="bg-white">
      <PageHeader eyebrow="Gestao e indicadores" title="A proposta precisa ser bonita, mas tambem precisa ser acompanhavel." />

      <div className="grid grid-cols-[0.9fr_1fr] gap-5 px-9">
        <div className="space-y-3">
          <Photo src={ASSETS.community} alt="Acao de relacionamento com a comunidade" className="h-[284px]" />
          <Photo src={ASSETS.workshop} alt="Oficina infantil e ativacao" className="h-[226px]" />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-3">
            {METRICS.map((metric, itemIndex) => (
              <div key={metric} className="rounded-md border border-[#dedbd2] bg-[#f7f3ea] p-4">
                <p className="text-[30px] font-semibold text-[#6d28d9]">{itemIndex + 1}</p>
                <p className="mt-7 text-[19px] font-semibold leading-tight text-[#241c2f]">{metric}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-md bg-[#d06045] p-5 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">Relatorio mensal</p>
            <p className="mt-4 text-[26px] font-semibold leading-tight">
              Para o {clientName}, cada ciclo termina com entregas, dados, aprendizados e recomendacoes praticas.
            </p>
          </div>
        </div>
      </div>
    </DocumentPage>
  );
}

function NextPage({ index, total, clientName, contactName, investmentNote }: SharedPageProps & { investmentNote: string }) {
  const steps = [
    "Validar escopo base e prioridades do cliente",
    "Revisar tom, identidade e paginas do template",
    "Definir cronograma de 90 dias e responsaveis",
    "Fechar proposta comercial e iniciar implantacao",
  ];

  return (
    <DocumentPage index={index} total={total} dark>
      <div className="relative flex h-full flex-col px-9 pb-20 pt-9">
        <div className="flex items-center justify-between">
          <ElephantBrand inverted />
          <div className="rounded-md border border-white/15 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
            Fechamento
          </div>
        </div>

        <div className="mt-16 grid grid-cols-[0.9fr_1fr] gap-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#f4b95f]">Proximos passos</p>
            <h2 className="mt-5 text-[56px] font-semibold leading-[0.95] tracking-tight">
              Vamos dar forma comercial ao {clientName}.
            </h2>
            <p className="mt-6 text-[22px] leading-tight text-white/76">{investmentNote}</p>
          </div>

          <div className="space-y-3">
            {steps.map((step, itemIndex) => (
              <div key={step} className="grid grid-cols-[44px_1fr] gap-4 rounded-md border border-white/12 bg-white/[0.06] p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f4b95f] text-sm font-bold text-[#241c2f]">
                  {itemIndex + 1}
                </span>
                <p className="text-[19px] font-semibold leading-snug text-white/86">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto grid grid-cols-[1fr_0.8fr] gap-4">
          <div className="rounded-md bg-white p-5 text-[#241c2f]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6d28d9]">Responsavel</p>
            <p className="mt-3 text-[28px] font-semibold">{contactName}</p>
          </div>
          <div className="rounded-md bg-[#f4b95f] p-5 text-[#241c2f]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]">Marca</p>
            <p className="mt-3 text-[28px] font-semibold">elephant.</p>
          </div>
        </div>
      </div>
    </DocumentPage>
  );
}

type SharedPageProps = {
  index: number;
  total: number;
  clientName: string;
  clientSegment: string;
  location: string;
  period: string;
  contactName: string;
};

function PageHeader({
  eyebrow,
  title,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <header className="px-9 pb-7 pt-9">
      <div className="flex items-start justify-between gap-8">
        <div>
          <p className={cn("text-[11px] font-bold uppercase tracking-[0.22em]", dark ? "text-[#f4b95f]" : "text-[#d06045]")}>
            {eyebrow}
          </p>
          <h2 className={cn("mt-4 max-w-[650px] text-[39px] font-semibold leading-[1.02] tracking-tight", dark ? "text-white" : "text-[#241c2f]")}>
            {title}
          </h2>
        </div>
        <ElephantBrand compact inverted={dark} />
      </div>
    </header>
  );
}

function ElephantBrand({ inverted = false, compact = false }: { inverted?: boolean; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", inverted ? "text-white" : "text-[#241c2f]")}>
      <span
        className={cn(
          "grid place-items-center rounded-md border text-sm font-bold",
          compact ? "h-7 w-7" : "h-9 w-9",
          inverted ? "border-white/25 bg-white/10" : "border-[#241c2f]/20 bg-white",
        )}
      >
        e
      </span>
      {!compact ? (
        <span className="text-[21px] font-bold tracking-tight">
          elephant<span className="text-[#f4b95f]">.</span>
        </span>
      ) : (
        <span>elephant.</span>
      )}
    </div>
  );
}

function CoverInfo({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/15 bg-white/8 p-4">
      <Icon size={18} className="text-[#f4b95f]" />
      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">{label}</p>
      <p className="mt-2 text-[17px] font-semibold leading-tight text-white/88">{value}</p>
    </div>
  );
}

function IconBlock({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-md border border-white/12 bg-white/[0.06] p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f4b95f] text-[#241c2f]">
          <Icon size={19} />
        </span>
        <h3 className="text-[21px] font-semibold leading-tight">{title}</h3>
      </div>
      <p className="mt-4 text-[15px] font-medium leading-snug text-white/68">{text}</p>
    </div>
  );
}

function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-md bg-[#dedbd2]", className)}>
      <Image src={src} alt={alt} fill sizes="820px" className="object-cover" />
    </div>
  );
}
