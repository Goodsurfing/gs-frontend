#!/usr/bin/env node
// Открыть страницу за IAP в headless Chromium и снять артефакты:
//   - PNG скриншот (full page по умолчанию, или viewport через --viewport)
//   - HTML дамп
// Используется как замена обычному браузеру для staging/dev (где IAP).
//
// Usage:
//   node scripts/iap-browse.mjs <url> [--out NAME] [--width 1280] [--height 800]
//                                     [--viewport] [--wait MS]
//
// Env:
//   IAP_TOKEN — bearer токен yandex-iap (yiap_...). Если не задан, берём
//   значение из package.json (E2E_IAP_TOKEN там захардкожен).
//
// Артефакты складываются в /tmp/iap-screens/<name>.{png,html}.

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { argv, env, exit } from "node:process";

const args = argv.slice(2);
if (args.length === 0 || args[0].startsWith("--")) {
    console.error("usage: node scripts/iap-browse.mjs <url> [--out name] [--width N] [--height N] [--viewport] [--wait MS]");
    exit(1);
}

const url = args[0];
const flag = (name, fallback) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : fallback;
};
const has = (name) => args.includes(`--${name}`);

const out = flag("out", new URL(url).pathname.replace(/[\/?&=]+/g, "_") || "root");
const width = Number(flag("width", 1280));
const height = Number(flag("height", 800));
const wait = Number(flag("wait", 1500));
const fullPage = !has("viewport");

const token = env.IAP_TOKEN || "yiap_66fa6fb58d3632ec2a187696244db59ea858be9c";

await mkdir("/tmp/iap-screens", { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
    viewport: { width, height },
    extraHTTPHeaders: { Authorization: `Bearer ${token}` },
    ignoreHTTPSErrors: true,
});
const page = await context.newPage();

await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 }).catch((e) => {
    console.warn("goto warning:", e.message);
});
await page.waitForTimeout(wait);

const pngPath = `/tmp/iap-screens/${out}.png`;
const htmlPath = `/tmp/iap-screens/${out}.html`;
const selector = flag("selector", null);
if (selector) {
    const el = await page.$(selector);
    if (!el) {
        console.error(`selector not found: ${selector}`);
        await browser.close();
        exit(2);
    }
    await el.screenshot({ path: pngPath });
} else {
    await page.screenshot({ path: pngPath, fullPage });
}
await writeFile(htmlPath, await page.content());

console.log(`url:        ${page.url()}`);
console.log(`viewport:   ${width}x${height} (fullPage=${fullPage})`);
console.log(`screenshot: ${pngPath}`);
console.log(`html:       ${htmlPath}`);

await browser.close();
