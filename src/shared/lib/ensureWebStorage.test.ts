import { describe, expect, it } from "vitest";

import { ensureWebStorage } from "./ensureWebStorage";

const fakeWindow = (storage: PropertyDescriptor) => {
    const win = {} as Window;
    Object.defineProperty(win, "localStorage", { ...storage, configurable: true });
    Object.defineProperty(win, "sessionStorage", { value: window.sessionStorage, configurable: true });
    return win;
};

describe("ensureWebStorage", () => {
    it("подставляет хранилище в памяти, если чтение localStorage бросает SecurityError", () => {
        const win = fakeWindow({
            get() {
                throw new DOMException("The operation is insecure.", "SecurityError");
            },
        });

        expect(ensureWebStorage(win)).toEqual(["localStorage"]);
        win.localStorage.setItem("token", "abc");
        expect(win.localStorage.getItem("token")).toBe("abc");
        expect(win.localStorage.getItem("missing")).toBeNull();
    });

    it("подставляет хранилище, если localStorage равен null (WebView)", () => {
        const win = fakeWindow({ value: null });

        expect(ensureWebStorage(win)).toEqual(["localStorage"]);
        expect(win.localStorage.getItem("i18nextLng")).toBeNull();
    });

    it("не трогает рабочее хранилище", () => {
        const win = fakeWindow({ value: window.localStorage });

        expect(ensureWebStorage(win)).toEqual([]);
        expect(win.localStorage).toBe(window.localStorage);
    });
});
