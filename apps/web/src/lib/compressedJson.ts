import { brotliCompressSync, constants, gzipSync } from "node:zlib";

import { NextResponse } from "next/server";

/**
 * JSON-ответ обработчика API, сжатый под браузер. Next сжимает страницы, но не
 * ответы обработчиков (app/…/route.ts): точки карты вакансий уходили несжатыми —
 * 617 КБ, на медленном мобильном интернете карта ждала их десятки секунд (04.11).
 * Brotli (уровень 5 — быстро и почти как максимум) или gzip; без поддержки — как есть.
 */
export function compressedJson(acceptEncoding: string | null, data: unknown, headers: Record<string, string> = {}): NextResponse {
    const body = Buffer.from(JSON.stringify(data));
    const accepted = (acceptEncoding ?? "").toLowerCase();
    const base = { "Content-Type": "application/json", Vary: "Accept-Encoding", ...headers };
    if (/\bbr\b/.test(accepted)) {
        const compressed = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } });
        return new NextResponse(new Uint8Array(compressed), { headers: { ...base, "Content-Encoding": "br" } });
    }
    if (/\bgzip\b/.test(accepted)) {
        return new NextResponse(new Uint8Array(gzipSync(body, { level: 6 })), { headers: { ...base, "Content-Encoding": "gzip" } });
    }
    return new NextResponse(new Uint8Array(body), { headers: base });
}
