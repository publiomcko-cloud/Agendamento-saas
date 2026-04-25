export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export function formatRoleLabel(role: string) {
  const map: Record<string, string> = {
    admin: "Administrador",
    attendant: "Atendente",
    client: "Cliente",
  };

  return map[role] ?? role;
}

export function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
