import { brotliDecompressSync, gunzipSync } from "node:zlib";

import { describe, expect, it } from "vitest";

import { compressedJson } from "../compressedJson";

const data = Array.from({ length: 200 }, (_, i) => ({ id: i, name: `Вакансия ${i}`, lat: 55.75, lng: 37.61 }));
const raw = JSON.stringify(data);

describe("сжатый JSON обработчиков API", () => {
    it("brotli, если браузер умеет", async () => {
        const response = compressedJson("gzip, deflate, br", data, { "Cache-Control": "private, max-age=60" });
        expect(response.headers.get("content-encoding")).toBe("br");
        expect(response.headers.get("vary")).toBe("Accept-Encoding");
        expect(response.headers.get("cache-control")).toBe("private, max-age=60");
        const body = Buffer.from(await response.arrayBuffer());
        expect(body.length).toBeLessThan(raw.length / 4);
        expect(JSON.parse(brotliDecompressSync(body).toString())).toEqual(data);
    });

    it("gzip, если brotli нет", async () => {
        const response = compressedJson("gzip", data);
        expect(response.headers.get("content-encoding")).toBe("gzip");
        expect(JSON.parse(gunzipSync(Buffer.from(await response.arrayBuffer())).toString())).toEqual(data);
    });

    it("без сжатия — как есть", async () => {
        const response = compressedJson(null, data);
        expect(response.headers.get("content-encoding")).toBeNull();
        expect(await response.json()).toEqual(data);
    });
});
