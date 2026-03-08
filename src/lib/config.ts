export const appConfig = {
  appName: "Tennjor Admin",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000",
} as const;
