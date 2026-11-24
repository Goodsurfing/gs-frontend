import { describe, expect, it } from "vitest";

import { addDays, applyDates, daysBetween, initialTerms, periodIndex, termsForPeriod } from "@/lib/applyDates";

const NOW = "2026-11-24";
const period = (start: string, ending: string) => ({ start: `${start}T00:00:00+00:00`, ending: `${ending}T00:00:00+00:00` });

describe("даты отклика (GS-290)", () => {
    it("addDays и daysBetween переходят через месяц и год", () => {
        expect(addDays("2026-12-25", 10)).toBe("2027-01-04");
        expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
        expect(daysBetween("2026-12-01", "2026-12-14")).toBe(14);
        expect(daysBetween("2026-12-01", "2026-12-01")).toBe(1);
    });

    it("смены организатора — выбор только из них: прошедшие скрыты, идущая — с сегодня, повторы убраны, по порядку", () => {
        const dates = applyDates({
            isFullYearAcceptable: false,
            periods: [
                period("2027-01-06", "2027-01-18"),
                period("2026-11-18", "2026-11-30"),
                period("2026-06-01", "2026-06-14"),
                period("2027-01-06", "2027-01-18"),
            ],
        }, NOW);
        expect(dates).toEqual({
            kind: "periods",
            minDays: 0,
            periods: [
                { start: NOW, end: "2026-11-30", window: false },
                { start: "2027-01-06", end: "2027-01-18", window: false },
            ],
        });
        // Несколько периодов — пока не выбран, отправить нельзя
        expect(initialTerms(dates)).toEqual({ start: null, end: null });
    });

    it("единственный период подставляется сам (раньше не работало: читали end вместо ending)", () => {
        const dates = applyDates({ isFullYearAcceptable: false, periods: [period("2027-04-12", "2027-04-25")] }, NOW);
        expect(initialTerms(dates)).toEqual({ start: "2027-04-12", end: "2027-04-25" });
    });

    it("сезон длиннее максимального срока — окно: подсказка с начала на минимальный срок, даты внутри можно поменять", () => {
        const dates = applyDates({ isFullYearAcceptable: false, durationMinDays: 7, durationMaxDays: 45, periods: [period("2027-04-30", "2027-10-29")] }, NOW);
        expect(dates.kind).toBe("periods");
        if (dates.kind !== "periods") return;
        expect(dates.periods[0]?.window).toBe(true);
        const terms = initialTerms(dates);
        expect(terms).toEqual({ start: "2027-04-30", end: "2027-05-06" });
        expect(periodIndex(dates.periods, terms)).toBe(0);
        // Свои даты внутри окна — период по-прежнему отмечен; за его пределами — нет
        expect(periodIndex(dates.periods, { start: "2027-06-01", end: "2027-06-20" })).toBe(0);
        expect(periodIndex(dates.periods, { start: "2027-10-20", end: "2027-11-05" })).toBe(-1);
    });

    it("без максимального срока окном считается период длиннее месяца", () => {
        const dates = applyDates({ periods: [period("2026-12-01", "2026-12-31"), period("2027-01-01", "2027-03-31")] }, NOW);
        expect(dates.kind === "periods" && dates.periods.map((item) => item.window)).toEqual([false, true]);
    });

    it("подсказка в окне не выходит за его конец", () => {
        expect(termsForPeriod({ start: "2026-12-20", end: "2026-12-28", window: true }, 30)).toEqual({ start: "2026-12-20", end: "2026-12-28" });
    });

    it("«в любое время», без периодов и со всеми прошедшими — даты подсказаны: через неделю на две недели или минимальный срок", () => {
        const free = { kind: "free", suggestion: { start: "2026-12-01", end: "2026-12-14" } };
        expect(applyDates({ isFullYearAcceptable: true, periods: [period("2027-01-01", "2027-02-01")] }, NOW)).toEqual(free);
        expect(applyDates({ isFullYearAcceptable: false, periods: [] }, NOW)).toEqual(free);
        expect(applyDates({ periods: [period("2018-06-10", "2018-06-24")] }, NOW)).toEqual(free);
        expect(applyDates(null, NOW)).toEqual(free);
        expect(applyDates({ isFullYearAcceptable: true, durationMinDays: 30 }, NOW)).toEqual({ kind: "free", suggestion: { start: "2026-12-01", end: "2026-12-30" } });
        // Подсказку сразу можно отправить — даты не требуются вручную
        expect(initialTerms(applyDates(null, NOW))).toEqual({ start: "2026-12-01", end: "2026-12-14" });
    });

    it("битые даты периода пропускаются", () => {
        expect(applyDates({ periods: [{ start: null, ending: "2027-01-01" }, { start: "2027-02-10", ending: "2027-02-01" }] }, NOW).kind).toBe("free");
    });
});
