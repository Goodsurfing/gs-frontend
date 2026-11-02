import { describe, expect, it, vi } from "vitest";

import { isChunkLoadError, reloadOnceForChunkError } from "../chunkReload";

const storage = (initial: Record<string, string> = {}) => {
    const data = { ...initial };
    return { getItem: (key: string) => data[key] ?? null, setItem: (key: string, value: string) => { data[key] = value; } };
};

describe("isChunkLoadError", () => {
    it("узнаёт незагрузившиеся чанки Next и браузеров", () => {
        const chunk = new Error("Loading chunk 123 failed.");
        chunk.name = "ChunkLoadError";
        expect(isChunkLoadError(chunk)).toBe(true);
        expect(isChunkLoadError(new Error("Loading chunk app/[locale]/page failed"))).toBe(true);
        expect(isChunkLoadError(new TypeError("Failed to fetch dynamically imported module: /x.js"))).toBe(true);
        expect(isChunkLoadError(new TypeError("Importing a module script failed."))).toBe(true);
    });

    it("не путает с обычными ошибками", () => {
        expect(isChunkLoadError(new TypeError("Cannot read properties of undefined"))).toBe(false);
        expect(isChunkLoadError(new TypeError("Failed to fetch"))).toBe(false);
    });
});

describe("reloadOnceForChunkError", () => {
    it("перезагружает один раз в минуту", () => {
        const store = storage();
        const reload = vi.fn();
        expect(reloadOnceForChunkError(store, reload, 1_000_000)).toBe(true);
        expect(reloadOnceForChunkError(store, reload, 1_030_000)).toBe(false);
        expect(reloadOnceForChunkError(store, reload, 1_070_000)).toBe(true);
        expect(reload).toHaveBeenCalledTimes(2);
    });
});
