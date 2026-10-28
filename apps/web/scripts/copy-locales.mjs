// Словари — общие со старым фронтом (public/locales), одни ключи и тексты.
// Копируются при сборке, чтобы образ был самодостаточным.
import { cpSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const from = fileURLToPath(new URL("../../../public/locales", import.meta.url));
const to = fileURLToPath(new URL("../locales", import.meta.url));
rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true });
console.log("locales copied");
