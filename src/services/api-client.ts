import { appConfig } from "@/src/lib/config";
import { loadAccessToken } from "@/src/features/auth/storage/auth-storage";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type RequestOptions<TBody = unknown> = {
  method?: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
  requireAuth?: boolean;
};

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<TResponse, TBody = unknown>(
    path: string,
    options: RequestOptions<TBody> = {},
  ): Promise<TResponse> {
    const { method = "GET", body, headers, requireAuth = true } = options;
    const token = requireAuth ? loadAccessToken() : null;
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body
        ? isFormData
          ? (body as BodyInit)
          : JSON.stringify(body)
        : undefined,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return undefined as TResponse;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as TResponse;
    }

    return (await response.text()) as TResponse;
  }
}

export const apiClient = new ApiClient(appConfig.apiBaseUrl);
