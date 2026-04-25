"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { DataTable, SectionCard, StatCard } from "@/components/ui";
import { apiRequest } from "@/lib/api";
import type { DashboardData } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || user?.role === "client") {
      return;
    }

    apiRequest<DashboardData>("/dashboard", { token })
      .then(setDashboard)
      .catch((requestError) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Nao foi possivel carregar o dashboard.",
        ),
      );
  }, [token, user?.role]);

  if (user?.role === "client") {
    return null;
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Dashboard
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
          Visao operacional do dia
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
          Resumo rapido da agenda, proximos atendimentos e receita paga para a
          data atual.
        </p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-[#efb2a5] bg-[#fff0ed] px-4 py-3 text-sm text-[#8a3723]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Agendamentos do dia"
          value={String(dashboard?.totals.appointmentsToday ?? 0)}
          tone="accent"
        />
        <StatCard
          label="Pagamentos do dia"
          value={String(dashboard?.totals.paymentsToday ?? 0)}
        />
        <StatCard
          label="Receita paga"
          value={formatCurrency(dashboard?.totals.revenuePaidToday ?? "0")}
          tone="warm"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Agenda do dia"
          description="Todos os atendimentos encontrados para hoje."
        >
          <DataTable
            columns={["Horario", "Cliente", "Servico", "Status"]}
            rows={(dashboard?.appointmentsToday ?? []).map((appointment) => [
              formatDateTime(appointment.scheduledAt),
              appointment.client.name,
              appointment.service.name,
              appointment.status,
            ])}
            emptyMessage="Nenhum atendimento encontrado para hoje."
          />
        </SectionCard>

        <SectionCard
          title="Proximos atendimentos"
          description="Recorte rapido para a operacao agir sem abrir filtros."
        >
          <DataTable
            columns={["Horario", "Cliente", "Servico", "Responsavel"]}
            rows={(dashboard?.upcomingAppointments ?? []).map((appointment) => [
              formatDateTime(appointment.scheduledAt),
              appointment.client.name,
              appointment.service.name,
              appointment.createdByUser?.email ?? "Nao informado",
            ])}
            emptyMessage="Nenhum proximo atendimento encontrado."
          />
        </SectionCard>
      </div>
    </div>
  );
}
