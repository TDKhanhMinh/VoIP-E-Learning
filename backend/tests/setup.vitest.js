// Vitest global setup
import { vi } from "vitest";

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";
process.env.GEMINI_API_KEY = "test-gemini-key";
process.env.LIVEKIT_URL = "wss://test.livekit.cloud";
process.env.LIVEKIT_API_KEY = "test-api-key";
process.env.LIVEKIT_API_SECRET = "test-api-secret";

// Mock console methods if needed
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
};
