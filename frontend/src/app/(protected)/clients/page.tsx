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
import type { Client } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

export default function ClientsPage() {
  const { token, user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(initialForm);

  const loadClients = useCallback(async () => {
    if (!token || user?.role === "client") {
      return;
    }

    try {
      const params = new URLSearchParams();
      if (search) {
        params.set("search", search);
      }
      if (activeFilter !== "all") {
        params.set("active", activeFilter);
      }

      const response = await apiRequest<Client[]>(
        `/clients${params.toString() ? `?${params.toString()}` : ""}`,
        { token },
      );
      setClients(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel carregar clientes.",
      );
    }
  }, [activeFilter, search, token, user?.role]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadClients();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadClients]);

  if (user?.role === "client") {
    return null;
  }

  const isEditing = Boolean(editingClientId);
  const selectedClient =
    clients.find((client) => client.id === selectedClientId) ?? null;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Clientes
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
          Cadastro e relacionamento basico
        </h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard
          title={isEditing ? "Editar cliente" : "Novo cliente"}
          description="Cadastro rapido para alimentar a operacao."
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
                    name: form.name,
                    email: form.email || undefined,
                    phone: form.phone || undefined,
                    notes: form.notes || undefined,
                  };

                  if (editingClientId) {
                    await apiRequest(`/clients/${editingClientId}`, {
                      method: "PATCH",
                      token,
                      body: payload,
                    });
                    setMessage("Cliente atualizado com sucesso.");
                  } else {
                    await apiRequest("/clients", {
                      method: "POST",
                      token,
                      body: payload,
                    });
                    setMessage("Cliente criado com sucesso.");
                  }

                  setForm(initialForm);
                  setEditingClientId(null);
                  setSelectedClientId(null);
                  await loadClients();
                } catch (submitError) {
                  setError(
                    submitError instanceof Error
                      ? submitError.message
                      : "Nao foi possivel salvar o cliente.",
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
            <Input
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
            />
            <Input
              label="Telefone"
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({ ...current, phone: event.target.value }))
              }
              placeholder="+5511999999999"
            />
            <Textarea
              label="Observacoes"
              value={form.notes}
              onChange={(event) =>
                setForm((current) => ({ ...current, notes: event.target.value }))
              }
            />
            <div className="flex flex-wrap gap-3">
              <PrimaryButton type="submit" disabled={isPending}>
                {isPending
                  ? isEditing
                    ? "Salvando..."
                    : "Cadastrando..."
                  : isEditing
                    ? "Salvar cliente"
                    : "Cadastrar cliente"}
              </PrimaryButton>
              {isEditing ? (
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setEditingClientId(null);
                    setSelectedClientId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancelar edicao
                </SecondaryButton>
              ) : null}
            </div>
          </form>

          {selectedClient ? (
            <div className="mt-6 rounded-3xl border border-[var(--color-border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Detalhes do cliente
              </p>
              <div className="mt-3 space-y-2 text-sm text-[var(--color-ink)]">
                <p>
                  <strong>Nome:</strong> {selectedClient.name}
                </p>
                <p>
                  <strong>E-mail:</strong> {selectedClient.email || "Sem e-mail"}
                </p>
                <p>
                  <strong>Telefone:</strong> {selectedClient.phone || "Sem telefone"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedClient.active ? "Ativo" : "Inativo"}
                </p>
                <p>
                  <strong>Criado em:</strong> {formatDateTime(selectedClient.createdAt)}
                </p>
                <p>
                  <strong>Observacoes:</strong>{" "}
                  {selectedClient.notes || "Sem observacoes"}
                </p>
              </div>
            </div>
          ) : null}
        </SectionCard>

        <SectionCard
          title="Base de clientes"
          description="Busca por nome, e-mail ou telefone."
          actions={
            <div className="flex flex-col gap-3 md:flex-row">
              <Input
                label="Busca"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar cliente"
                className="md:min-w-64"
              />
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
            columns={["Nome", "Contato", "Observacoes", "Status", "Acoes"]}
            rows={clients.map((client) => [
              client.name,
              <div key={client.id}>
                <p>{client.email || "Sem e-mail"}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {client.phone || "Sem telefone"}
                </p>
              </div>,
              client.notes || "Sem observacoes",
              client.active ? "Ativo" : "Inativo",
              <div key={`${client.id}-actions`} className="flex flex-wrap gap-2">
                <SecondaryButton
                  type="button"
                  className="px-3 py-2"
                  onClick={() => setSelectedClientId(client.id)}
                >
                  Ver detalhe
                </SecondaryButton>
                <SecondaryButton
                  type="button"
                  className="px-3 py-2"
                  onClick={() => {
                    setEditingClientId(client.id);
                    setSelectedClientId(client.id);
                    setForm({
                      name: client.name,
                      email: client.email ?? "",
                      phone: client.phone ?? "",
                      notes: client.notes ?? "",
                    });
                  }}
                >
                  Editar
                </SecondaryButton>
                <SecondaryButton
                  type="button"
                  className="px-3 py-2"
                  disabled={!client.active || isPending}
                  onClick={() => {
                    setError(null);
                    setMessage(null);
                    startTransition(async () => {
                      try {
                        await apiRequest(`/clients/${client.id}/deactivate`, {
                          method: "PATCH",
                          token,
                        });
                        setMessage("Cliente inativado com sucesso.");
                        await loadClients();
                      } catch (actionError) {
                        setError(
                          actionError instanceof Error
                            ? actionError.message
                            : "Nao foi possivel inativar o cliente.",
                        );
                      }
                    });
                  }}
                >
                  Inativar
                </SecondaryButton>
              </div>,
            ])}
            emptyMessage="Nenhum cliente encontrado."
          />
        </SectionCard>
      </div>
    </div>
  );
}
