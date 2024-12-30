/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    testTimeout: 600_000,
    hookTimeout: 600_000,
    watch: false,
    exclude: ["src/examples/**", "node_modules/**"],
  },
});
