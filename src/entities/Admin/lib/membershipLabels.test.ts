import { describe, expect, it } from "vitest";
import { formatAdminDate, formatAdminDateTime, formatLogEndDate } from "./membershipLabels";

describe("membershipLabels", () => {
    it("показывает дату по Москве", () => {
        // 23:59:59 по Москве — тот же день, а не следующий по UTC
        expect(formatAdminDate("2027-10-29T23:59:59+03:00")).toBe("29.10.2027");
        expect(formatAdminDateTime("2026-10-29T21:30:00+00:00")).toBe("30.10.2026, 00:30");
        expect(formatAdminDate(null)).toBe("—");
    });

    it("срок в журнале: дата, бессрочно или прочерк для снятия", () => {
        expect(formatLogEndDate({ action: "GRANT", endDate: "2027-10-29T23:59:59+03:00" })).toBe("29.10.2027");
        expect(formatLogEndDate({ action: "GRANT", endDate: null })).toBe("бессрочно");
        expect(formatLogEndDate({ action: "REVOKE", endDate: null })).toBe("—");
    });
});
