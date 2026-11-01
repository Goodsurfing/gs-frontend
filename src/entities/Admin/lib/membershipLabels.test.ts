import { describe, expect, it } from "vitest";
import { formatAdminDate, formatAdminDateTime, formatLogEndDate } from "./membershipLabels";

describe("membershipLabels", () => {
    it("дата — как записал сервер, время журнала — по Москве", () => {
        // «до 31.01» сервер хранит как 31.01 23:59:59 UTC — не 01.02
        expect(formatAdminDate("2027-01-31T23:59:59+00:00")).toBe("31.01.2027");
        expect(formatAdminDateTime("2026-10-29T21:30:00+00:00")).toBe("30.10.2026, 00:30");
        expect(formatAdminDate(null)).toBe("—");
    });

    it("срок в журнале: дата, бессрочно или прочерк для снятия", () => {
        expect(formatLogEndDate({ action: "GRANT", endDate: "2027-10-29T23:59:59+03:00" })).toBe("29.10.2027");
        expect(formatLogEndDate({ action: "GRANT", endDate: null })).toBe("бессрочно");
        expect(formatLogEndDate({ action: "REVOKE", endDate: null })).toBe("—");
    });
});
