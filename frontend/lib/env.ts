export const frontendEnv = {
  apiBaseUrl: process.env.NEXT_PUBLIC_SIGNALTRACK_API_BASE_URL ?? "http://localhost:3000",
  useMocks: (process.env.NEXT_PUBLIC_SIGNALTRACK_USE_MOCKS ?? "true") === "true",
  useMockAuth: (process.env.NEXT_PUBLIC_SIGNALTRACK_USE_MOCK_AUTH ?? process.env.NEXT_PUBLIC_SIGNALTRACK_USE_MOCKS ?? "true") === "true"
};
