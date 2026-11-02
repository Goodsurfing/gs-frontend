// Сравнение видимого текста старой и новой страницы (эпик GS-212).
//
//   node scripts/text-compare.mjs --old https://staging.goodsurfing.org/en/blog --new http://localhost:3100/en/blog
//
// Дополняет visual-compare: неверный заголовок или ключ словаря вместо перевода
// дают доли процента пиксельной разницы, а здесь видны сразу. Сравниваются
// строки текста основной части страницы (от блока с h1), без шапки и подвала.
//
//   --new-cookie имя=значение  cookie для новой страницы (gs_web=1 на стейдже)
//   --login почта:пароль  кабинет: вход через API (api-staging или --api URL), токен —
//                     в localStorage обеих страниц; браузер без CORS (как в visual-compare)
//   CHROMIUM_PATH=…   свой Chromium вместо браузера @playwright/test
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const get = (name) => args[args.indexOf(`--${name}`) + 1];
const oldUrl = get("old");
const newUrl = get("new");
const newCookie = args.includes("--new-cookie") ? get("new-cookie") : undefined;
const login = args.includes("--login") ? get("login") : undefined;
const apiUrl = args.includes("--api") ? get("api") : "https://api-staging.goodsurfing.org";
if (!oldUrl || !newUrl) {
    console.error("нужно: --old URL --new URL [--new-cookie имя=значение]");
    process.exit(2);
}

let auth = null;
if (login) {
    const [email, password] = login.split(/:(.*)/s);
    const response = await fetch(`${apiUrl}/api/v1/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        console.error(`вход ${email}: ${response.status}`);
        process.exit(2);
    }
    const { accessToken, mercureToken, roles } = await response.json();
    auth = { email, token: accessToken, mercureToken, roles: roles ?? [] };
}
const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: login ? ["--disable-web-security"] : [],
});
const grab = async (url, cookie) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    if (cookie) {
        const [name, value] = cookie.split("=");
        await context.addCookies([{ name, value, domain: new URL(url).hostname, path: "/" }]);
    }
    if (auth) {
        await context.addInitScript((a) => {
            localStorage.setItem("user", JSON.stringify({ username: a.email }));
            localStorage.setItem("token", JSON.stringify(a.token));
            localStorage.setItem("mercureToken", JSON.stringify(a.mercureToken));
            localStorage.setItem("roles", JSON.stringify(a.roles));
        }, auth);
    }
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    // Кабинет дорисовывается после запросов с токеном
    if (auth) await page.waitForTimeout(1500);
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
