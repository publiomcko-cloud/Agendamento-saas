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
} from "@/components/ui";
import { apiRequest } from "@/lib/api";
import type { Appointment, Payment } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const initialForm = {
  appointmentId: "",
  amount: "",
  status: "paid",
  method: "pix",
  paidAt: "",
};

export default function PaymentsPage() {
  const { token, user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  const loadData = useCallback(async () => {
    if (!token || user?.role === "client") {
      return;
    }

    try {
      const paymentParams = new URLSearchParams();
      if (statusFilter !== "all") {
        paymentParams.set("status", statusFilter);
      }

      const [paymentsResponse, appointmentsResponse] = await Promise.all([
        apiRequest<Payment[]>(
          `/payments${paymentParams.toString() ? `?${paymentParams.toString()}` : ""}`,
          { token },
        ),
        apiRequest<Appointment[]>("/appointments", { token }),
      ]);

      setPayments(paymentsResponse);
      setAppointments(
        appointmentsResponse.filter((appointment) => appointment.status !== "cancelled"),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel carregar pagamentos.",
      );
    }
  }, [statusFilter, token, user?.role]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  if (user?.role === "client") {
    return null;
  }

  const isEditing = Boolean(editingPaymentId);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Pagamentos
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
          Financeiro basico
        </h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard
          title={isEditing ? "Atualizar pagamento" : "Registrar pagamento"}
          description="Fluxo manual vinculado a um agendamento."
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setError(null);
              setMessage(null);

              startTransition(async () => {
                try {
                  const payload = {
                    appointmentId: form.appointmentId,
                    amount: Number(form.amount),
                    status: form.status,
                    method: form.method,
                    paidAt: form.paidAt
                      ? new Date(form.paidAt).toISOString()
                      : undefined,
                  };

                  if (editingPaymentId) {
                    await apiRequest(`/payments/${editingPaymentId}`, {
                      method: "PATCH",
                      token,
                      body: payload,
                    });
                    setMessage("Pagamento atualizado com sucesso.");
                  } else {
                    await apiRequest("/payments", {
                      method: "POST",
                      token,
                      body: payload,
                    });
                    setMessage("Pagamento registrado com sucesso.");
                  }

                  setEditingPaymentId(null);
                  setForm(initialForm);
                  await loadData();
                } catch (submitError) {
                  setError(
                    submitError instanceof Error
                      ? submitError.message
                      : "Nao foi possivel salvar o pagamento.",
                  );
                }
              });
            }}
          >
            <Select
              label="Agendamento"
              value={form.appointmentId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  appointmentId: event.target.value,
                }))
              }
              required
              disabled={isEditing}
            >
              <option value="">Selecione</option>
              {appointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {appointment.client.name} - {appointment.service.name}
                </option>
              ))}
            </Select>
            <Input
              label="Valor"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(event) =>
                setForm((current) => ({ ...current, amount: event.target.value }))
              }
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Status"
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({ ...current, status: event.target.value }))
                }
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
                <option value="failed">Falhou</option>
                <option value="refunded">Estornado</option>
              </Select>
              <Select
                label="Metodo"
                value={form.method}
                onChange={(event) =>
                  setForm((current) => ({ ...current, method: event.target.value }))
                }
              >
                <option value="pix">Pix</option>
                <option value="cash">Dinheiro</option>
                <option value="credit_card">Cartao de credito</option>
                <option value="debit_card">Cartao de debito</option>
                <option value="other">Outro</option>
              </Select>
            </div>
            <Input
              label="Data do pagamento"
              type="datetime-local"
              value={form.paidAt}
              onChange={(event) =>
                setForm((current) => ({ ...current, paidAt: event.target.value }))
              }
            />
            <div className="flex flex-wrap gap-3">
              <PrimaryButton type="submit" disabled={isPending}>
                {isPending
                  ? isEditing
                    ? "Salvando..."
                    : "Registrando..."
                  : isEditing
                    ? "Salvar pagamento"
                    : "Registrar pagamento"}
              </PrimaryButton>
              {isEditing ? (
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setEditingPaymentId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancelar edicao
                </SecondaryButton>
              ) : null}
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Historico financeiro"
          description="Valores e status registrados para a operacao."
          actions={
            <Select
              label="Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="md:min-w-44"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="paid">Pagos</option>
              <option value="failed">Falhos</option>
              <option value="refunded">Estornados</option>
            </Select>
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
            columns={["Agendamento", "Valor", "Status", "Data", "Acoes"]}
            rows={payments.map((payment) => [
              `${payment.appointment.client.name} - ${payment.appointment.service.name}`,
              formatCurrency(payment.amount),
              payment.status,
              payment.paidAt ? formatDateTime(payment.paidAt) : "Nao pago",
              <div key={payment.id} className="flex flex-wrap gap-2">
                <SecondaryButton
                  type="button"
                  className="px-3 py-2"
                  onClick={() => {
                    setEditingPaymentId(payment.id);
                    setForm({
                      appointmentId: payment.appointmentId,
                      amount: String(payment.amount),
                      status: payment.status,
                      method: payment.method ?? "other",
                      paidAt: payment.paidAt
                        ? new Date(payment.paidAt).toISOString().slice(0, 16)
                        : "",
                    });
                  }}
                >
                  Editar status
                </SecondaryButton>
              </div>,
            ])}
            emptyMessage="Nenhum pagamento encontrado."
          />
        </SectionCard>
      </div>
    </div>
  );
}
