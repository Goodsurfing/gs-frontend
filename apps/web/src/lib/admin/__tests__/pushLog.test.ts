import { describe, expect, it } from "vitest";

import { okPercent, providerTitle, statusMeaning, typeTitle } from "../pushLog";

describe("журнал пушей в админке", () => {
    it("сервисы и типы — понятными словами, неизвестные — как есть", () => {
        expect(providerTitle("mozilla")).toBe("Firefox (Mozilla)");
        expect(providerTitle("push.example.org")).toBe("push.example.org");
        expect(typeTitle("application_status")).toBe("Статус заявки");
        expect(typeTitle("new_kind")).toBe("new_kind");
    });

    it("коды ответа — подсказка, куда смотреть", () => {
        expect(statusMeaning(410)).toContain("удалена");
        expect(statusMeaning(404)).toContain("удалена");
        expect(statusMeaning(403)).toContain("VAPID");
        expect(statusMeaning(503)).toContain("сбой");
        expect(statusMeaning(null)).toContain("не дошло");
        expect(statusMeaning(201)).toBe("");
    });

    it("доля доставленных", () => {
        expect(okPercent({ total: 3, ok: 2, errors: 1 })).toBe(67);
        expect(okPercent({ total: 0, ok: 0, errors: 0 })).toBeNull();
    });
});
