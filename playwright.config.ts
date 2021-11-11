import { PlaywrightTestConfig } from "@playwright/test";
const config: PlaywrightTestConfig = {
  webServer: {
    command: "NODE_ENV=test npm run serve -- --port 8888",
    port: 8888,
    reuseExistingServer: false
  },
  testDir: "tests/e2e",
  use: {
    browserName: "chromium"
  }
};
export default config;
