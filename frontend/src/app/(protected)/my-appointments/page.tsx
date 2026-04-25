"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  DataTable,
  Input,
  PrimaryButton,
  SecondaryButton,
  SectionCard,
} from "@/components/ui";
import { apiRequest } from "@/lib/api";
import type { Appointment } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export default function MyAppointmentsPage() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");

  const loadAppointments = useCallback(() => {
    if (!token) {
      return Promise.resolve();
    }

    return apiRequest<Appointment[]>("/appointments", { token })
      .then(setAppointments)
      .catch((requestError) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Nao foi possivel carregar seus agendamentos.",
        ),
      );
  }, [token]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Area do cliente
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
          Meus agendamentos
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Acompanhe horarios marcados e o status de cada atendimento.
        </p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-[#efb2a5] bg-[#fff0ed] px-4 py-3 text-sm text-[#8a3723]">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-2xl border border-[#b6e2cf] bg-[#effaf4] px-4 py-3 text-sm text-[#21583c]">
          {message}
        </div>
      ) : null}

      {rescheduleTarget ? (
        <SectionCard
          title="Reagendar atendimento"
          description={`Atualize o horario para ${rescheduleTarget.service.name}.`}
        >
          <form
            className="flex flex-col gap-4 md:flex-row md:items-end"
            onSubmit={(event) => {
              event.preventDefault();
              setError(null);
              setMessage(null);

              startTransition(async () => {
                try {
                  await apiRequest(
                    `/appointments/${rescheduleTarget.id}/reschedule`,
                    {
                      method: "PATCH",
                      token,
                      body: {
                        scheduledAt: new Date(rescheduleDate).toISOString(),
                      },
                    },
                  );
                  setMessage("Agendamento reagendado com sucesso.");
                  setRescheduleTarget(null);
                  setRescheduleDate("");
                  await loadAppointments();
                } catch (submitError) {
                  setError(
                    submitError instanceof Error
                      ? submitError.message
                      : "Nao foi possivel reagendar o atendimento.",
                  );
                }
              });
            }}
          >
            <Input
              label="Novo horario"
              type="datetime-local"
              value={rescheduleDate}
              onChange={(event) => setRescheduleDate(event.target.value)}
              required
            />
            <div className="flex gap-3">
              <PrimaryButton type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Confirmar reagendamento"}
              </PrimaryButton>
              <SecondaryButton
                type="button"
                onClick={() => {
                  setRescheduleTarget(null);
                  setRescheduleDate("");
                }}
              >
                Cancelar
              </SecondaryButton>
            </div>
          </form>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Agenda pessoal"
        description="Somente os registros vinculados ao seu cadastro."
      >
        <DataTable
          columns={["Horario", "Servico", "Status", "Observacoes", "Acoes"]}
          rows={appointments.map((appointment) => [
            `${formatDateTime(appointment.scheduledAt)} - ${formatDateTime(
              appointment.endAt,
            )}`,
            appointment.service.name,
            appointment.status,
            appointment.notes || "Sem observacoes",
            <div key={appointment.id} className="flex flex-wrap gap-2">
              <SecondaryButton
                type="button"
                className="px-3 py-2"
                disabled={appointment.status !== "scheduled" || isPending}
                onClick={() => {
                  setRescheduleTarget(appointment);
                  setRescheduleDate(
                    new Date(appointment.scheduledAt)
                      .toISOString()
                      .slice(0, 16),
                  );
                }}
              >
                Reagendar
              </SecondaryButton>
              <SecondaryButton
                type="button"
                className="px-3 py-2"
                disabled={appointment.status !== "scheduled" || isPending}
                onClick={() => {
                  setError(null);
                  setMessage(null);

                  startTransition(async () => {
                    try {
                      await apiRequest(`/appointments/${appointment.id}/cancel`, {
                        method: "PATCH",
                        token,
                      });
                      setMessage("Agendamento cancelado com sucesso.");
                      if (rescheduleTarget?.id === appointment.id) {
                        setRescheduleTarget(null);
                        setRescheduleDate("");
                      }
                      await loadAppointments();
                    } catch (actionError) {
                      setError(
                        actionError instanceof Error
                          ? actionError.message
                          : "Nao foi possivel cancelar o atendimento.",
                      );
                    }
                  });
                }}
              >
                Cancelar
              </SecondaryButton>
            </div>,
          ])}
          emptyMessage="Voce ainda nao possui agendamentos cadastrados."
        />
      </SectionCard>
    </div>
  );
}
