"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { classNames, formatRoleLabel } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

const adminNavigation = [
  { href: "/users", label: "Usuarios" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clientes" },
  { href: "/services", label: "Servicos" },
  { href: "/appointments", label: "Agendamentos" },
  { href: "/payments", label: "Pagamentos" },
];

const attendantNavigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clientes" },
  { href: "/services", label: "Servicos" },
  { href: "/appointments", label: "Agendamentos" },
  { href: "/payments", label: "Pagamentos" },
];

const clientNavigation = [
  { href: "/my-appointments", label: "Meus agendamentos" },
  { href: "/book-appointment", label: "Novo agendamento" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { initialized, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!user) {
      router.replace("/");
      return;
    }

    const allowedPaths =
      user.role === "admin"
        ? adminNavigation.map((item) => item.href)
        : user.role === "attendant"
          ? attendantNavigation.map((item) => item.href)
          : clientNavigation.map((item) => item.href);

    if (!allowedPaths.includes(pathname)) {
      router.replace(allowedPaths[0] ?? "/");
    }
  }, [initialized, pathname, router, user]);

  if (!initialized || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)]">
        <div className="rounded-3xl border border-[var(--color-border)] bg-white px-8 py-6 text-sm text-[var(--color-muted)] shadow-sm">
          Carregando ambiente...
        </div>
      </div>
    );
  }

  const navigation =
    user.role === "admin"
      ? adminNavigation
      : user.role === "attendant"
        ? attendantNavigation
        : clientNavigation;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:px-6">
        <aside className="w-full rounded-[32px] border border-[var(--color-border)] bg-[linear-gradient(180deg,#0f2a2e_0%,#173b42_100%)] p-6 text-white shadow-xl lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-80">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">
              Agendamento SaaS
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Operacao em tempo real
            </h1>
            <p className="text-sm leading-6 text-white/70">
              Acesso rapido aos modulos principais do MVP.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">
              Sessao ativa
            </p>
            <p className="mt-2 text-lg font-medium">{user.email}</p>
            <p className="text-sm text-white/70">{formatRoleLabel(user.role)}</p>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    "rounded-2xl px-4 py-3 text-sm transition",
                    isActive
                      ? "bg-[var(--color-accent)] text-[var(--color-ink)]"
                      : "text-white/78 hover:bg-white/8 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-white/10 bg-[#f4c95d] px-4 py-4 text-[var(--color-ink)]">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink)]/65">
              Perfil
            </p>
            <p className="mt-2 text-sm leading-6">
              {getRoleMessage(user.role)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/");
            }}
            className="mt-8 w-full rounded-2xl border border-white/12 px-4 py-3 text-sm text-white/85 transition hover:bg-white/8"
          >
            Sair
          </button>
        </aside>

        <main className="flex-1 rounded-[32px] border border-[var(--color-border)] bg-white p-5 shadow-xl shadow-[rgba(10,31,38,0.07)] md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function getRoleMessage(role: UserRole) {
  if (role === "client") {
    return "Acompanhe seus horarios, reagende quando necessario e mantenha sua agenda em dia.";
  }

  if (role === "attendant") {
    return "Visualize a agenda do dia, acompanhe clientes e mantenha o atendimento fluindo.";
  }

  return "Monitore a operacao, acompanhe receita e organize os modulos principais do sistema.";
}
