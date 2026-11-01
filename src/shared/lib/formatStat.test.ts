import { describe, expect, it } from "vitest";

import { formatStatNumber, roundStat } from "./formatStat";

describe("formatStat", () => {
    it("округляет крупные числа до тысяч, остальные — до сотен", () => {
        expect(roundStat(23663)).toBe(23000);
        expect(roundStat(1706)).toBe(1700);
        expect(roundStat(845)).toBe(800);
    });

    it("ставит разделитель разрядов", () => {
        expect(formatStatNumber(23663, "ru").replace(/\s/g, " ")).toBe("23 663");
        expect(formatStatNumber(23663, "en")).toBe("23,663");
        expect(formatStatNumber(74, "ru")).toBe("74");
    });
});
