"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import {
  Input,
  PrimaryButton,
  SectionCard,
  Select,
  Textarea,
} from "@/components/ui";
import { apiRequest } from "@/lib/api";
import type { Service } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function BookAppointmentPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    serviceId: "",
    scheduledAt: "",
    notes: "",
  });

  useEffect(() => {
    if (!token || user?.role !== "client") {
      return;
    }

    apiRequest<Service[]>("/services", { token })
      .then((response) => setServices(response.filter((service) => service.active)))
      .catch((requestError) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Nao foi possivel carregar os servicos.",
        ),
      );
  }, [token, user?.role]);

  if (user?.role !== "client") {
    return null;
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Novo agendamento
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
          Reserve seu proximo horario
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
          Escolha um servico, defina a data e envie sua solicitacao. O sistema
          valida conflito de horario automaticamente.
        </p>
      </header>

      <SectionCard
        title="Agendar atendimento"
        description="Os horarios sao validados no backend para evitar conflito."
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
                    serviceId: form.serviceId,
                    scheduledAt: new Date(form.scheduledAt).toISOString(),
                    notes: form.notes || undefined,
                  },
                });
                setForm({
                  serviceId: "",
                  scheduledAt: "",
                  notes: "",
                });
                setMessage("Agendamento criado com sucesso.");
                window.setTimeout(() => {
                  router.replace("/my-appointments");
                }, 800);
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
                {service.name} • {service.durationMinutes} min •{" "}
                {formatCurrency(service.price)}
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
            {isPending ? "Agendando..." : "Confirmar agendamento"}
          </PrimaryButton>
        </form>
      </SectionCard>
    </div>
  );
}
