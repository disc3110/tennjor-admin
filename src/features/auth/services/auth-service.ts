import type { LoginPayload, LoginResponse } from "@/src/features/auth/types/auth";
import { apiClient } from "@/src/services/api-client";

export const authService = {
  login(payload: LoginPayload) {
    return apiClient.request<LoginResponse, LoginPayload>("/auth/login", {
      method: "POST",
      body: payload,
      requireAuth: false,
    });
  },
};
