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
  { href: "/account", label: "Conta" },
];

const attendantNavigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clientes" },
  { href: "/services", label: "Servicos" },
  { href: "/appointments", label: "Agendamentos" },
  { href: "/payments", label: "Pagamentos" },
  { href: "/account", label: "Conta" },
];

const clientNavigation = [
  { href: "/my-appointments", label: "Meus agendamentos" },
  { href: "/book-appointment", label: "Novo agendamento" },
  { href: "/account", label: "Conta" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { initialized, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  function handleSignOut() {
    logout();
    router.replace("/");
  }

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
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
        <div className="rounded-[32px] border border-[var(--color-border)] bg-[linear-gradient(180deg,#0f2a2e_0%,#173b42_100%)] p-5 text-white shadow-xl md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between">
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                Agendamento SaaS
              </p>
              <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                Operacao em tempo real
              </h1>
              <p className="max-w-2xl text-sm leading-5 text-white/70">
                Acesso rapido aos modulos principais do MVP.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[210px_180px]">
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                  Sessao ativa
                </p>
                <p className="mt-1.5 text-base font-medium">{user.email}</p>
                <p className="text-sm text-white/70">{formatRoleLabel(user.role)}</p>
                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-xl border border-white/12 px-4 py-2 text-xs font-medium text-white/85 transition hover:bg-white/8"
                  >
                    Sair
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#f4c95d] px-4 py-3.5 text-[var(--color-ink)]">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink)]/65">
                  Perfil
                </p>
                <p className="mt-1.5 text-sm leading-5">
                  {getRoleMessage(user.role)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="overflow-x-auto pb-2">
            <nav
              className="grid min-w-max gap-2"
              style={{
                gridTemplateColumns: `repeat(${navigation.length}, minmax(112px, 1fr))`,
              }}
            >
              {navigation.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={classNames(
                      "relative rounded-t-[22px] border px-4 py-3 text-center text-sm font-medium transition",
                      isActive
                        ? "z-10 -mb-px border-[var(--color-border)] border-b-white bg-white text-[var(--color-ink)] shadow-[0_-8px_24px_rgba(10,31,38,0.06)]"
                        : "border-[#d7cfbf] bg-[linear-gradient(180deg,#fbf5e8_0%,#f2e7cf_100%)] text-[var(--color-muted)] hover:bg-[#f7eedc] hover:text-[var(--color-ink)]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <main className="relative -mt-[1px] rounded-b-[32px] rounded-t-none border border-[var(--color-border)] bg-white p-5 shadow-xl shadow-[rgba(10,31,38,0.07)] md:p-8">
            {children}
          </main>
        </div>
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
