// Сравнение видимого текста старой и новой страницы (эпик GS-212).
//
//   node scripts/text-compare.mjs --old https://staging.goodsurfing.org/en/blog --new http://localhost:3100/en/blog
//
// Дополняет visual-compare: неверный заголовок или ключ словаря вместо перевода
// дают доли процента пиксельной разницы, а здесь видны сразу. Сравниваются
// строки текста основной части страницы (от блока с h1), без шапки и подвала.
//
//   --new-cookie имя=значение  cookie для новой страницы (gs_web=1 на стейдже)
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const get = (name) => args[args.indexOf(`--${name}`) + 1];
const oldUrl = get("old");
const newUrl = get("new");
const newCookie = args.includes("--new-cookie") ? get("new-cookie") : undefined;
if (!oldUrl || !newUrl) {
    console.error("нужно: --old URL --new URL [--new-cookie имя=значение]");
    process.exit(2);
}

const browser = await chromium.launch();
const grab = async (url, cookie) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    if (cookie) {
        const [name, value] = cookie.split("=");
        await context.addCookies([{ name, value, domain: new URL(url).hostname, path: "/" }]);
    }
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    const lines = await page.evaluate(() => {
        const root = document.querySelector("h1")?.parentElement?.parentElement ?? document.body;
        return root.innerText.split("\n").map((line) => line.trim()).filter(Boolean);
    });
    await context.close();
    return lines;
};

const [before, after] = [await grab(oldUrl), await grab(newUrl, newCookie)];
await browser.close();
const onlyOld = before.filter((line) => !after.includes(line));
const onlyNew = after.filter((line) => !before.includes(line));
console.log("только в старом:", onlyOld);
console.log("только в новом:", onlyNew);
process.exit(onlyOld.length || onlyNew.length ? 1 : 0);
