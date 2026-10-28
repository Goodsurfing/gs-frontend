import { chromium } from '@playwright/test';
const [,, out] = process.argv;
const b = await chromium.launch(); const ctx = await b.newContext({ storageState: 'e2e/.auth/vol.json', viewport: { width: 1280, height: 900 } }); const p = await ctx.newPage();
await p.goto('https://staging.goodsurfing.org/ru/favorite-offers'); await p.waitForTimeout(1500);
await p.goto('https://staging.goodsurfing.org/ru/offers-map'); await p.waitForTimeout(6000);
const card = p.locator('img[alt="offer-img"]').first().locator('xpath=ancestor::*[contains(@class,"")][3]');
await p.locator('img[alt="offer-img"]').first().locator('..').screenshot({ path: out });
console.log('ok');
await b.close();
