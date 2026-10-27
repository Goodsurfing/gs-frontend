import {
    describe, it, expect, vi,
} from "vitest";
import { handleChunkLoadError } from "./handleChunkLoadError";

const makeStorage = (initial: Record<string, string> = {}) => {
    const data = { ...initial };
    return {
        getItem: (key: string) => data[key] ?? null,
        setItem: (key: string, value: string) => { data[key] = value; },
        data,
    };
};

describe("handleChunkLoadError", () => {
    it("перезагружает страницу и гасит ошибку при первом сбое", () => {
        const event = new Event("vite:preloadError", { cancelable: true });
        const storage = makeStorage();
        const reload = vi.fn();

        handleChunkLoadError(event, storage, reload, 1_000_000);

        expect(reload).toHaveBeenCalledTimes(1);
        expect(event.defaultPrevented).toBe(true);
        expect(storage.data["chunk-reload-at"]).toBe("1000000");
    });

    it("не перезагружает повторно в течение минуты — без бесконечного цикла", () => {
        const event = new Event("vite:preloadError", { cancelable: true });
        const storage = makeStorage({ "chunk-reload-at": "1000000" });
        const reload = vi.fn();

        handleChunkLoadError(event, storage, reload, 1_030_000);

        expect(reload).not.toHaveBeenCalled();
        expect(event.defaultPrevented).toBe(false);
    });

    it("снова перезагружает, если прошло больше минуты", () => {
        const event = new Event("vite:preloadError", { cancelable: true });
        const storage = makeStorage({ "chunk-reload-at": "1000000" });
        const reload = vi.fn();

        handleChunkLoadError(event, storage, reload, 1_070_000);

        expect(reload).toHaveBeenCalledTimes(1);
    });
});
