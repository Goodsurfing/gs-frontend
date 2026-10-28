// Типы API из спецификации бэкенда (gs-backend/docs/openapi.json — она же
// отдаётся на /api/doc.json). Источник по умолчанию — стейдж; можно указать
// файл: OPENAPI_SOURCE=../../../gs-backend/docs/openapi.json npm run generate
// --check: сравнить с закоммиченными типами (контракт для CI).
import { readFile, writeFile } from "node:fs/promises";
import openapiTS, { astToString } from "openapi-typescript";

const source = process.env.OPENAPI_SOURCE ?? "https://api-staging.goodsurfing.org/api/doc.json";
const target = new URL("../src/schema.d.ts", import.meta.url);

const spec = source.startsWith("http")
    ? await (await fetch(source)).json()
    : JSON.parse(await readFile(source, "utf8"));

const header = `// Сгенерировано из OpenAPI gs-backend (${source.startsWith("http") ? "/api/doc.json" : "docs/openapi.json"}).\n// Не править руками: npm run generate в packages/api.\n\n`;
const output = header + astToString(await openapiTS(spec, { alphabetize: true }));

if (process.argv.includes("--check")) {
    const current = await readFile(target, "utf8").catch(() => "");
    if (current !== output) {
        console.error("Типы API устарели: запустите npm run generate в packages/api");
        process.exit(1);
    }
    console.log("Типы API актуальны");
} else {
    await writeFile(target, output);
    console.log(`Типы API обновлены из ${source}`);
}
