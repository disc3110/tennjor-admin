import { appConfig } from "@/src/lib/config";
import { loadAccessToken } from "@/src/features/auth/storage/auth-storage";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type RequestOptions<TBody = unknown> = {
  method?: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
  requireAuth?: boolean;
};

type BlobResponse = {
  blob: Blob;
  headers: Headers;
};

export class ApiClientError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<TResponse, TBody = unknown>(
    path: string,
    options: RequestOptions<TBody> = {},
  ): Promise<TResponse> {
    const response = await this.fetchResponse(path, options);

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return undefined as TResponse;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as TResponse;
    }

    return (await response.text()) as TResponse;
  }

  async requestBlob<TBody = unknown>(
    path: string,
    options: RequestOptions<TBody> = {},
  ): Promise<BlobResponse> {
    const response = await this.fetchResponse(path, options);
    return {
      blob: await response.blob(),
      headers: response.headers,
    };
  }

  private async fetchResponse<TBody = unknown>(
    path: string,
    options: RequestOptions<TBody> = {},
  ): Promise<Response> {
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
      let message = `API request failed: ${response.status}`;
      let data: unknown;

      try {
        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          data = await response.json();
          if (
            typeof data === "object" &&
            data !== null &&
            "message" in data &&
            typeof (data as { message?: unknown }).message === "string"
          ) {
            message = (data as { message: string }).message;
          }
        } else {
          const text = await response.text();
          if (text.trim().length > 0) message = text;
        }
      } catch {
        // Keep fallback message when parsing fails.
      }

      throw new ApiClientError(response.status, message, data);
    }

    return response;
  }
}

export const apiClient = new ApiClient(appConfig.apiBaseUrl);
