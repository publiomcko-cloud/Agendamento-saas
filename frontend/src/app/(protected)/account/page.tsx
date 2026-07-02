"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { PrimaryButton, SectionCard } from "@/components/ui";
import { formatDateTime, formatRoleLabel } from "@/lib/utils";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  function handleSignOut() {
    logout();
    router.replace("/");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Conta
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
          Conta atual
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
          Informacoes do usuario autenticado e controles da sessao atual.
        </p>
      </header>

      <SectionCard
        title="Minha conta"
        description="Resumo da conta ativa no navegador."
        actions={
          <PrimaryButton type="button" onClick={handleSignOut}>
            Sair
          </PrimaryButton>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InfoCard
            label="Nome"
            value={user.name?.trim() ? user.name : "Nao informado"}
          />
          <InfoCard label="E-mail" value={user.email} />
          <InfoCard label="Perfil" value={formatRoleLabel(user.role)} />
          <InfoCard
            label="Status"
            value={user.active === false ? "Inativo" : "Ativo"}
          />
          <InfoCard
            label="Criado em"
            value={user.createdAt ? formatDateTime(user.createdAt) : "Nao informado"}
          />
          <InfoCard
            label="Atualizado em"
            value={user.updatedAt ? formatDateTime(user.updatedAt) : "Nao informado"}
          />
        </div>
      </SectionCard>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-3 text-base font-medium text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
