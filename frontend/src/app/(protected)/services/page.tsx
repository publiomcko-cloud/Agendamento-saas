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
import type { Service } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const initialForm = {
  name: "",
  description: "",
  durationMinutes: "30",
  price: "50",
};

export default function ServicesPage() {
  const { token, user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(initialForm);

  const loadServices = useCallback(async () => {
    if (!token || user?.role === "client") {
      return;
    }

    try {
      const params = new URLSearchParams();
      if (activeFilter !== "all") {
        params.set("active", activeFilter);
      }

      const response = await apiRequest<Service[]>(
        `/services${params.toString() ? `?${params.toString()}` : ""}`,
        { token },
      );
      setServices(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel carregar servicos.",
      );
    }
  }, [activeFilter, token, user?.role]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadServices();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadServices]);

  if (user?.role === "client") {
    return null;
  }

  const canManage = user?.role === "admin";
  const isEditing = Boolean(editingServiceId);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Servicos
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
          Catalogo operacional
        </h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard
          title={isEditing ? "Editar servico" : "Novo servico"}
          description="Controle de duracao, valor e disponibilidade."
        >
          {!canManage ? (
            <p className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-4 text-sm text-[var(--color-muted)]">
              O perfil atendente tem acesso apenas de consulta neste modulo.
            </p>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setError(null);
                setMessage(null);

                startTransition(async () => {
                  try {
                    const payload = {
                      name: form.name,
                      description: form.description || undefined,
                      durationMinutes: Number(form.durationMinutes),
                      price: Number(form.price),
                    };

                    if (editingServiceId) {
                      await apiRequest(`/services/${editingServiceId}`, {
                        method: "PATCH",
                        token,
                        body: payload,
                      });
                      setMessage("Servico atualizado com sucesso.");
                    } else {
                      await apiRequest("/services", {
                        method: "POST",
                        token,
                        body: payload,
                      });
                      setMessage("Servico criado com sucesso.");
                    }

                    setForm(initialForm);
                    setEditingServiceId(null);
                    await loadServices();
                  } catch (submitError) {
                    setError(
                      submitError instanceof Error
                        ? submitError.message
                        : "Nao foi possivel salvar o servico.",
                    );
                  }
                });
              }}
            >
              <Input
                label="Nome"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                required
              />
              <Textarea
                label="Descricao"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Duracao (minutos)"
                  type="number"
                  min="1"
                  value={form.durationMinutes}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      durationMinutes: event.target.value,
                    }))
                  }
                />
                <Input
                  label="Preco"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, price: event.target.value }))
                  }
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <PrimaryButton type="submit" disabled={isPending}>
                  {isPending
                    ? isEditing
                      ? "Salvando..."
                      : "Cadastrando..."
                    : isEditing
                      ? "Salvar servico"
                      : "Cadastrar servico"}
                </PrimaryButton>
                {isEditing ? (
                  <SecondaryButton
                    type="button"
                    onClick={() => {
                      setEditingServiceId(null);
                      setForm(initialForm);
                    }}
                  >
                    Cancelar edicao
                  </SecondaryButton>
                ) : null}
              </div>
            </form>
          )}
        </SectionCard>

        <SectionCard
          title="Lista de servicos"
          description="Valores e duracoes configurados para a agenda."
          actions={
            <Select
              label="Status"
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.target.value)}
              className="md:min-w-44"
            >
              <option value="all">Todos</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
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
            columns={["Servico", "Duracao", "Preco", "Status", "Acoes"]}
            rows={services.map((service) => [
              <div key={service.id}>
                <p>{service.name}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {service.description || "Sem descricao"}
                </p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  Criado em {formatDateTime(service.createdAt)}
                </p>
              </div>,
              `${service.durationMinutes} min`,
              formatCurrency(service.price),
              service.active ? "Ativo" : "Inativo",
              canManage ? (
                <div key={`${service.id}-actions`} className="flex flex-wrap gap-2">
                  <SecondaryButton
                    type="button"
                    className="px-3 py-2"
                    onClick={() => {
                      setEditingServiceId(service.id);
                      setForm({
                        name: service.name,
                        description: service.description ?? "",
                        durationMinutes: String(service.durationMinutes),
                        price: String(service.price),
                      });
                    }}
                  >
                    Editar
                  </SecondaryButton>
                  <SecondaryButton
                    type="button"
                    className="px-3 py-2"
                    disabled={isPending}
                    onClick={() => {
                      setError(null);
                      setMessage(null);
                      startTransition(async () => {
                        try {
                          await apiRequest(
                            `/services/${service.id}/${service.active ? "deactivate" : "activate"}`,
                            {
                              method: "PATCH",
                              token,
                            },
                          );
                          setMessage(
                            service.active
                              ? "Servico desativado com sucesso."
                              : "Servico reativado com sucesso.",
                          );
                          await loadServices();
                        } catch (actionError) {
                          setError(
                            actionError instanceof Error
                              ? actionError.message
                              : "Nao foi possivel atualizar o servico.",
                          );
                        }
                      });
                    }}
                  >
                    {service.active ? "Desativar" : "Ativar"}
                  </SecondaryButton>
                </div>
              ) : (
                "Consulta"
              ),
            ])}
            emptyMessage="Nenhum servico encontrado."
          />
        </SectionCard>
      </div>
    </div>
  );
}
