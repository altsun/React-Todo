import { defineConfig } from "@playwright/test";

const origin = "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/browser",
  use: {
    baseURL: origin,
    browserName: "chromium",
    launchOptions: process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {}
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1",
    url: origin,
    reuseExistingServer: false
  }
});
