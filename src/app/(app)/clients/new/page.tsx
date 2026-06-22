import { PageHeader } from "@/components/ui";
import { ClientForm } from "@/components/client-form";

export default function NewClientPage() {
  return (
    <div>
      <PageHeader
        title="Novo cliente"
        description="Defina o perfil visual da marca para gerar artes consistentes."
      />
      <ClientForm />
    </div>
  );
}
