"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useAuth } from "@/components/auth-provider";
import { Input, PrimaryButton } from "@/components/ui";
import { formatRoleLabel } from "@/lib/utils";

export default function LoginPage() {
  const { initialized, user, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin@123456");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!initialized || !user) {
      return;
    }

    router.replace(user.role === "client" ? "/my-appointments" : "/dashboard");
  }, [initialized, router, user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const response = await login(email, password);
        router.replace(
          response.user.role === "client" ? "/my-appointments" : "/dashboard",
        );
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Nao foi possivel autenticar.",
        );
      }
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#fff4d1_0%,#f7f1e4_35%,#eef5f1_100%)] px-4 py-8">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-[-6rem] top-[-6rem] h-52 w-52 rounded-full bg-[var(--color-accent)]/45 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-64 w-64 rounded-full bg-[var(--color-accent-soft)] blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[36px] border border-white/60 bg-[linear-gradient(160deg,rgba(15,42,46,0.96)_0%,rgba(22,53,59,0.94)_100%)] p-8 text-white shadow-2xl md:p-12">
          <p className="text-xs uppercase tracking-[0.28em] text-white/60">
            Projeto Ancora 1
          </p>
          <h1 className="mt-4 max-w-xl font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight md:text-6xl">
            Agenda, clientes e operacao em um unico lugar.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/75 md:text-lg">
            Uma base full-stack para pequenas empresas acompanharem atendimento,
            pagamentos e agenda diaria sem planilhas soltas ou conversas
            perdidas.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Perfis", "admin, atendente e cliente"],
              ["Rotina", "agenda, servicos, clientes e pagamentos"],
              ["MVP", "fluxo ponta a ponta com API real"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-[28px] border border-white/10 bg-white/6 p-4"
              >
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-2 text-sm leading-6 text-white/70">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-[var(--color-border)] bg-white/95 p-6 shadow-2xl backdrop-blur md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Acesso
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
              Entrar na plataforma
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              Use um dos usuarios seeded do ambiente local para navegar pelos
              fluxos ja implementados.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@empresa.com"
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Sua senha"
            />

            {error ? (
              <div className="rounded-2xl border border-[#efb2a5] bg-[#fff0ed] px-4 py-3 text-sm text-[#8a3723]">
                {error}
              </div>
            ) : null}

            <PrimaryButton type="submit" disabled={isPending} className="w-full">
              {isPending ? "Entrando..." : "Entrar"}
            </PrimaryButton>
          </form>

          <div className="mt-8 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Credenciais locais
            </p>
            <div className="mt-3 space-y-3 text-sm text-[var(--color-ink)]">
              {[
                ["admin@example.com", "Admin@123456", "admin"],
                ["attendant@example.com", "Attendant@123456", "attendant"],
                ["client@example.com", "Client@123456", "client"],
              ].map(([userEmail, userPassword, role]) => (
                <button
                  key={userEmail}
                  type="button"
                  onClick={() => {
                    setEmail(userEmail);
                    setPassword(userPassword);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl border border-transparent bg-white px-4 py-3 text-left transition hover:border-[var(--color-border)]"
                >
                  <div>
                    <p className="font-medium">{userEmail}</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {formatRoleLabel(role)}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--color-muted)]">
                    {userPassword}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
