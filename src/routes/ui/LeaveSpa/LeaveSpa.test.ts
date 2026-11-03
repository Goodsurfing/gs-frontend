import { describe, expect, it } from "vitest";

import { shouldLeaveSpa } from "./LeaveSpa";

describe("shouldLeaveSpa", () => {
    it("переход из админки на адрес нового фронта — перезагрузка страницы", () => {
        expect(shouldLeaveSpa("/volunteers/42", "/admin/users")).toBe(true);
        expect(shouldLeaveSpa("/organizations/7", "/host-personal/7")).toBe(true);
    });

    it("SPA загрузилась прямо с неизвестным адресом — настоящая 404, без цикла перезагрузок", () => {
        expect(shouldLeaveSpa("/no-such-page", "/no-such-page")).toBe(false);
    });
});
