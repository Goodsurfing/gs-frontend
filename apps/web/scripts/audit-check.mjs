// Аудит зависимостей для CI: как `npm audit --omit=dev --audit-level=moderate`,
// но уязвимости из audit-allowlist.json (с причиной и сроком) пропускаются.
// Просроченное исключение снова валит проверку.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const LEVELS = { info: 0, low: 1, moderate: 2, high: 3, critical: 4 };
const allow = JSON.parse(readFileSync(new URL("../audit-allowlist.json", import.meta.url), "utf8"));
const today = new Date().toISOString().slice(0, 10);

let raw;
try {
    raw = execFileSync("npm", ["audit", "--omit=dev", "--json"], { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
} catch (error) {
    // npm audit выходит с ненулевым кодом, если что-то нашёл, — отчёт всё равно в stdout
    raw = error.stdout;
}
const report = JSON.parse(raw);

const problems = [];
const skipped = new Set();
for (const [name, vuln] of Object.entries(report.vulnerabilities ?? {})) {
    for (const via of vuln.via) {
        if (typeof via !== "object" || LEVELS[via.severity] < LEVELS.moderate) continue;
        const id = String(via.url ?? "").split("/").pop();
        const entry = allow[id];
        if (entry && entry.until >= today) {
            skipped.add(`${id} (${entry.package}) — до ${entry.until}`);
            continue;
        }
        const why = entry ? `исключение истекло ${entry.until}` : "нет в audit-allowlist.json";
        problems.push(`${via.severity} ${name}: ${via.title} ${via.url} — ${why}`);
    }
}

for (const line of skipped) console.log(`пропущено: ${line}`);
if (problems.length) {
    console.error(`Уязвимости (moderate и выше):\n${[...new Set(problems)].join("\n")}`);
    process.exit(1);
}
console.log("Аудит зависимостей: уязвимостей moderate и выше нет (кроме пропущенных выше).");
