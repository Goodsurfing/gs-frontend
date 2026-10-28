// Визуальное сравнение элементов старого и нового фронта (эпик GS-212).
//
//   node scripts/visual-compare.mjs --old https://staging.goodsurfing.org/ru \
//     --new http://localhost:3100/ru --part ribbon='aside[aria-label]' --part footer=footer
//
// Для каждой ширины (390/768/1280) снимает элементы на обеих страницах и
// печатает долю отличающихся пикселей; картинки различий — в /tmp/visual-compare.
// Фиксированные элементы (шапка) перед снимком скрываются. Размеры элементов
// на РАЗНЫХ страницах могут отличаться на 1 px из-за дробной координаты начала —
// в этом случае сравнивать getBoundingClientRect, итоговая проверка — e2e/visual.
import { chromium } from "@playwright/test";
import fs from "node:fs";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const args = process.argv.slice(2);
const get = (name) => args.flatMap((a, i) => (a === `--${name}` ? [args[i + 1]] : []));
const [oldUrl] = get("old");
const [newUrl] = get("new");
const parts = Object.fromEntries(get("part").map((p) => p.split(/=(.*)/s).slice(0, 2)));
const widths = (get("widths")[0] ?? "390,768,1280").split(",").map(Number);
if (!oldUrl || !newUrl || !Object.keys(parts).length) {
    console.error("нужно: --old URL --new URL --part имя=селектор [--widths 390,768,1280]");
    process.exit(2);
}

const out = "/tmp/visual-compare";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
let worst = 0;
for (const width of widths) {
    const shots = {};
    for (const [tag, url] of [["old", oldUrl], ["new", newUrl]]) {
        const page = await (await browser.newContext({ viewport: { width, height: 900 } })).newPage();
        await page.goto(url, { waitUntil: "networkidle" }).catch(() => undefined);
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(() => {
            for (const el of document.querySelectorAll("body *")) {
                const { position } = getComputedStyle(el);
                if (position === "fixed" || position === "sticky") el.style.visibility = "hidden";
            }
        });
        for (const [name, selector] of Object.entries(parts)) {
            shots[`${tag}-${name}`] = PNG.sync.read(await page.locator(selector).first().screenshot({ animations: "disabled" }));
        }
        await page.close();
    }
    for (const name of Object.keys(parts)) {
        const a = shots[`old-${name}`];
        const b = shots[`new-${name}`];
        if (a.width !== b.width || a.height !== b.height) {
            console.log(`${width} ${name}: размер старый ${a.width}×${a.height}, новый ${b.width}×${b.height}`);
            fs.writeFileSync(`${out}/${width}-${name}-old.png`, PNG.sync.write(a));
            fs.writeFileSync(`${out}/${width}-${name}-new.png`, PNG.sync.write(b));
            worst = Math.max(worst, 100);
            continue;
        }
        const diff = new PNG({ width: a.width, height: a.height });
        const changed = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
        const percent = (100 * changed) / (a.width * a.height);
        worst = Math.max(worst, percent);
        console.log(`${width} ${name}: ${percent.toFixed(2)}% (${a.width}×${a.height})`);
        fs.writeFileSync(`${out}/${width}-${name}-diff.png`, PNG.sync.write(diff));
    }
}
await browser.close();
process.exit(worst > 2 ? 1 : 0);
