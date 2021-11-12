import { test, expect } from "@playwright/test";
import { chromium } from "playwright";
import { makeVideoFromImages, scaleImages } from "./util/ffmpeg";

test("happy path", async ({ page, baseURL }, testInfo) => {
  const secret = "top secret";
  const images = `%01d.png`;
  const video = "fake-camera.y4m";

  await test.step("create QR codes", async () => {
    await page.goto(`${baseURL}`);
    await page.click("#shareNav");
    await page.fill("#secretTitle", "Title");
    await page.fill("#secret", secret);
    await page.click("#generateBtn");

    const qrCodes = page.locator("#print .qr-tile .card-qr canvas");
    await expect(qrCodes).toHaveCount(3);
    await qrCodes.first().screenshot({ path: testInfo.outputPath("1.png") });
    await qrCodes.last().screenshot({ path: testInfo.outputPath("2.png") });
  });

  await test.step("make qr code images the same size", async () => {
    await scaleImages(testInfo.outputPath(images));
  });

  await test.step("make video from qr codes", async () => {
    await makeVideoFromImages(
      testInfo.outputPath(images),
      testInfo.outputPath(video)
    );
  });

  await test.step("restore secret", async () => {
    const browser = await chromium.launch({
      args: [
        "--use-fake-ui-for-media-stream",
        "--use-fake-device-for-media-stream",
        `--use-file-for-fake-video-capture=${testInfo.outputPath(video)}`,
      ],
    });

    const page = await browser.newPage();
    await page.goto(`${baseURL}`);
    await page.click("#combineNav");
    await page.waitForSelector("#passphrase");
    await page.fill("#passphrase", "TEST");
    await page.click("#reconstructBtn");
    await expect(page.locator("#recoveredSecret")).toHaveValue(secret);
  });
});
