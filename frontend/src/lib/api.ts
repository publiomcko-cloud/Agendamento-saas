type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = (await safeJson(response)) as
      | { message?: string | string[] }
      | undefined;

    const message = Array.isArray(payload?.message)
      ? payload.message.join(", ")
      : payload?.message || "Nao foi possivel concluir a requisicao.";

    throw new ApiError(message, response.status);
  }

  return (await safeJson(response)) as T;
}

async function safeJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}
