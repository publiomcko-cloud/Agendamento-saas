"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  DataTable,
  Input,
  PrimaryButton,
  SecondaryButton,
  SectionCard,
  Select,
  Textarea,
} from "@/components/ui";
import { apiRequest } from "@/lib/api";
import type { Appointment, Client, Service } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

const initialCreateForm = {
  clientId: "",
  serviceId: "",
  scheduledAt: "",
  notes: "",
};

export default function AppointmentsPage() {
  const { token, user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(
    null,
  );
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    scheduledAt: "",
    notes: "",
  });
  const [form, setForm] = useState(initialCreateForm);

  const loadData = useCallback(async () => {
    if (!token || user?.role === "client") {
      return;
    }

    try {
      const appointmentParams = new URLSearchParams();
      if (statusFilter !== "all") {
        appointmentParams.set("status", statusFilter);
      }
      if (dateFilter) {
        const dateStart = new Date(`${dateFilter}T00:00:00`);
        const dateEnd = new Date(`${dateFilter}T23:59:59`);
        appointmentParams.set("dateFrom", dateStart.toISOString());
        appointmentParams.set("dateTo", dateEnd.toISOString());
      }

      const [appointmentsResponse, clientsResponse, servicesResponse] =
        await Promise.all([
          apiRequest<Appointment[]>(
            `/appointments${appointmentParams.toString() ? `?${appointmentParams.toString()}` : ""}`,
            { token },
          ),
          apiRequest<Client[]>("/clients?active=true", { token }),
          apiRequest<Service[]>("/services?active=true", { token }),
        ]);

      setAppointments(appointmentsResponse);
      setClients(clientsResponse.filter((client) => client.active));
      setServices(servicesResponse.filter((service) => service.active));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel carregar agendamentos.",
      );
    }
  }, [dateFilter, statusFilter, token, user?.role]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  if (user?.role === "client") {
    return null;
  }

  const selectedAppointment =
    appointments.find((appointment) => appointment.id === selectedAppointmentId) ??
    null;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Agendamentos
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
          Agenda operacional
        </h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <SectionCard
            title="Novo agendamento"
            description="O backend calcula o horario final e bloqueia conflitos."
          >
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setError(null);
                setMessage(null);

                startTransition(async () => {
                  try {
                    await apiRequest("/appointments", {
                      method: "POST",
                      token,
                      body: {
                        clientId: form.clientId,
                        serviceId: form.serviceId,
                        scheduledAt: new Date(form.scheduledAt).toISOString(),
                        notes: form.notes || undefined,
                      },
                    });
                    setForm(initialCreateForm);
                    setMessage("Agendamento criado com sucesso.");
                    setSelectedAppointmentId(null);
                    await loadData();
                  } catch (submitError) {
                    setError(
                      submitError instanceof Error
                        ? submitError.message
                        : "Nao foi possivel criar o agendamento.",
                    );
                  }
                });
              }}
            >
              <Select
                label="Cliente"
                value={form.clientId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, clientId: event.target.value }))
                }
                required
              >
                <option value="">Selecione</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Servico"
                value={form.serviceId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, serviceId: event.target.value }))
                }
                required
              >
                <option value="">Selecione</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Select>
              <Input
                label="Data e horario"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    scheduledAt: event.target.value,
                  }))
                }
                required
              />
              <Textarea
                label="Observacoes"
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({ ...current, notes: event.target.value }))
                }
              />
              <PrimaryButton type="submit" disabled={isPending}>
                {isPending ? "Agendando..." : "Criar agendamento"}
              </PrimaryButton>
            </form>
          </SectionCard>

          {rescheduleTarget ? (
            <SectionCard
              title="Reagendar atendimento"
              description={`Atualize o horario de ${rescheduleTarget.client.name}.`}
            >
              <form
                className="space-y-4"
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
                            scheduledAt: new Date(
                              rescheduleForm.scheduledAt,
                            ).toISOString(),
                            notes: rescheduleForm.notes || undefined,
                          },
                        },
                      );
                      setMessage("Agendamento reagendado com sucesso.");
                      setRescheduleTarget(null);
                      setRescheduleForm({ scheduledAt: "", notes: "" });
                      await loadData();
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
                  value={rescheduleForm.scheduledAt}
                  onChange={(event) =>
                    setRescheduleForm((current) => ({
                      ...current,
                      scheduledAt: event.target.value,
                    }))
                  }
                  required
                />
                <Textarea
                  label="Observacoes"
                  value={rescheduleForm.notes}
                  onChange={(event) =>
                    setRescheduleForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                />
                <div className="flex flex-wrap gap-3">
                  <PrimaryButton type="submit" disabled={isPending}>
                    {isPending ? "Salvando..." : "Confirmar reagendamento"}
                  </PrimaryButton>
                  <SecondaryButton
                    type="button"
                    onClick={() => {
                      setRescheduleTarget(null);
                      setRescheduleForm({ scheduledAt: "", notes: "" });
                    }}
                  >
                    Cancelar
                  </SecondaryButton>
                </div>
              </form>
            </SectionCard>
          ) : null}

          {selectedAppointment ? (
            <SectionCard
              title="Detalhe do agendamento"
              description="Recorte rapido para conferencias operacionais."
            >
              <div className="space-y-2 text-sm text-[var(--color-ink)]">
                <p>
                  <strong>Cliente:</strong> {selectedAppointment.client.name}
                </p>
                <p>
                  <strong>Servico:</strong> {selectedAppointment.service.name}
                </p>
                <p>
                  <strong>Status:</strong> {selectedAppointment.status}
                </p>
                <p>
                  <strong>Inicio:</strong>{" "}
                  {formatDateTime(selectedAppointment.scheduledAt)}
                </p>
                <p>
                  <strong>Fim:</strong> {formatDateTime(selectedAppointment.endAt)}
                </p>
                <p>
                  <strong>Criado por:</strong>{" "}
                  {selectedAppointment.createdByUser?.email || "Nao informado"}
                </p>
                <p>
                  <strong>Observacoes:</strong>{" "}
                  {selectedAppointment.notes || "Sem observacoes"}
                </p>
              </div>
            </SectionCard>
          ) : null}
        </div>

        <SectionCard
          title="Agenda"
          description="Listagem operacional por horario."
          actions={
            <div className="flex flex-col gap-3 md:flex-row">
              <Input
                label="Data"
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="md:min-w-44"
              />
              <Select
                label="Status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="md:min-w-44"
              >
                <option value="all">Todos</option>
                <option value="scheduled">Agendado</option>
                <option value="completed">Concluido</option>
                <option value="cancelled">Cancelado</option>
                <option value="no_show">No show</option>
              </Select>
            </div>
          }
        >
          {message ? (
            <div className="mb-4 rounded-2xl border border-[#b6e2cf] bg-[#effaf4] px-4 py-3 text-sm text-[#21583c]">
              {message}
            </div>
          ) : null}
          {error ? (
            <div className="mb-4 rounded-2xl border border-[#efb2a5] bg-[#fff0ed] px-4 py-3 text-sm text-[#8a3723]">
              {error}
            </div>
          ) : null}
          <DataTable
            columns={["Horario", "Cliente", "Servico", "Status", "Acoes"]}
            rows={appointments.map((appointment) => [
              `${formatDateTime(appointment.scheduledAt)} - ${formatDateTime(
                appointment.endAt,
              )}`,
              appointment.client.name,
              appointment.service.name,
              appointment.status,
              <div key={appointment.id} className="flex flex-wrap gap-2">
                <SecondaryButton
                  type="button"
                  className="px-3 py-2"
                  onClick={() => setSelectedAppointmentId(appointment.id)}
                >
                  Ver detalhe
                </SecondaryButton>
                <SecondaryButton
                  type="button"
                  className="px-3 py-2"
                  disabled={appointment.status !== "scheduled"}
                  onClick={() => {
                    setRescheduleTarget(appointment);
                    setRescheduleForm({
                      scheduledAt: new Date(appointment.scheduledAt)
                        .toISOString()
                        .slice(0, 16),
                      notes: appointment.notes ?? "",
                    });
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
                        await loadData();
                      } catch (actionError) {
                        setError(
                          actionError instanceof Error
                            ? actionError.message
                            : "Nao foi possivel cancelar o agendamento.",
                        );
                      }
                    });
                  }}
                >
                  Cancelar
                </SecondaryButton>
              </div>,
            ])}
            emptyMessage="Nenhum agendamento encontrado."
          />
        </SectionCard>
      </div>
    </div>
  );
}
