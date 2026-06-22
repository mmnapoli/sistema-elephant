"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { deleteClient } from "@/app/(app)/clients/actions";

export function DeleteClientButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <Button variant="secondary" onClick={() => setConfirming(true)}>
        <Trash2 size={16} /> Excluir
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted">Excluir cliente e suas artes?</span>
      <Button
        variant="danger"
        size="sm"
        disabled={pending}
        onClick={() => startTransition(() => deleteClient(id))}
      >
        {pending ? "Excluindo..." : "Sim, excluir"}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
        Cancelar
      </Button>
    </div>
  );
}
