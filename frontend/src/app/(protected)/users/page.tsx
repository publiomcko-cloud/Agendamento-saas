"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  DataTable,
  Input,
  PrimaryButton,
  SectionCard,
  SecondaryButton,
  Select,
} from "@/components/ui";
import { apiRequest } from "@/lib/api";
import type { UserRecord, UserRole } from "@/lib/types";
import { formatDateTime, formatRoleLabel } from "@/lib/utils";

const initialForm = {
  name: "",
  email: "",
  role: "attendant" as UserRole,
  password: "",
};

export default function UsersPage() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  const loadUsers = useCallback(async () => {
    if (!token || user?.role !== "admin") {
      return;
    }

    try {
      const params = new URLSearchParams();
      if (search) {
        params.set("search", search);
      }

      const response = await apiRequest<UserRecord[]>(
        `/users${params.toString() ? `?${params.toString()}` : ""}`,
        { token },
      );
      setUsers(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel carregar usuarios.",
      );
    }
  }, [search, token, user?.role]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadUsers]);

  if (user?.role !== "admin") {
    return null;
  }

  const isEditing = Boolean(editingUserId);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Usuarios
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
          Contas internas do sistema
        </h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard
          title={isEditing ? "Editar usuario" : "Novo usuario"}
          description="Somente administradores podem gerenciar acessos."
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setError(null);
              setMessage(null);

              startTransition(async () => {
                try {
                  const body = {
                    name: form.name,
                    email: form.email,
                    role: form.role,
                    password: form.password || undefined,
                  };

                  if (editingUserId) {
                    await apiRequest(`/users/${editingUserId}`, {
                      method: "PATCH",
                      token,
                      body,
                    });
                    setMessage("Usuario atualizado com sucesso.");
                  } else {
                    await apiRequest("/users", {
                      method: "POST",
                      token,
                      body: {
                        ...body,
                        password: form.password,
                      },
                    });
                    setMessage("Usuario criado com sucesso.");
                  }

                  setForm(initialForm);
                  setEditingUserId(null);
                  await loadUsers();
                } catch (submitError) {
                  setError(
                    submitError instanceof Error
                      ? submitError.message
                      : "Nao foi possivel salvar o usuario.",
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
              required
            />
            <Select
              label="Perfil"
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value as UserRole,
                }))
              }
            >
              <option value="admin">Administrador</option>
              <option value="attendant">Atendente</option>
              <option value="client">Cliente</option>
            </Select>
            <Input
              label={isEditing ? "Nova senha" : "Senha"}
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder={
                isEditing ? "Preencha apenas se quiser trocar" : "Senha inicial"
              }
              required={!isEditing}
            />
            <div className="flex flex-wrap gap-3">
              <PrimaryButton type="submit" disabled={isPending}>
                {isPending
                  ? isEditing
                    ? "Salvando..."
                    : "Criando..."
                  : isEditing
                    ? "Salvar alteracoes"
                    : "Cadastrar usuario"}
              </PrimaryButton>
              {isEditing ? (
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setEditingUserId(null);
                    setForm(initialForm);
                    setError(null);
                    setMessage(null);
                  }}
                >
                  Cancelar edicao
                </SecondaryButton>
              ) : null}
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Equipe e acessos"
          description="Gerencie perfis e status de acesso."
          actions={
            <Input
              label="Busca"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar usuario"
              className="md:min-w-64"
            />
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
            columns={["Usuario", "Perfil", "Status", "Criado em", "Acoes"]}
            rows={users.map((record) => [
              <div key={record.id}>
                <p>{record.name}</p>
                <p className="text-xs text-[var(--color-muted)]">{record.email}</p>
              </div>,
              formatRoleLabel(record.role),
              record.active ? "Ativo" : "Inativo",
              formatDateTime(record.createdAt),
              <div key={`${record.id}-actions`} className="flex flex-wrap gap-2">
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setEditingUserId(record.id);
                    setForm({
                      name: record.name,
                      email: record.email,
                      role: record.role,
                      password: "",
                    });
                    setError(null);
                    setMessage(null);
                  }}
                  className="px-3 py-2"
                >
                  Editar
                </SecondaryButton>
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMessage(null);

                    startTransition(async () => {
                      try {
                        await apiRequest(
                          `/users/${record.id}/${record.active ? "deactivate" : "activate"}`,
                          {
                            method: "PATCH",
                            token,
                          },
                        );
                        setMessage(
                          record.active
                            ? "Usuario inativado com sucesso."
                            : "Usuario ativado com sucesso.",
                        );
                        await loadUsers();
                      } catch (actionError) {
                        setError(
                          actionError instanceof Error
                            ? actionError.message
                            : "Nao foi possivel atualizar o status do usuario.",
                        );
                      }
                    });
                  }}
                  className="px-3 py-2"
                  disabled={isPending}
                >
                  {record.active ? "Inativar" : "Ativar"}
                </SecondaryButton>
              </div>,
            ])}
            emptyMessage="Nenhum usuario encontrado."
          />
        </SectionCard>
      </div>
    </div>
  );
}
