import {
    afterEach, beforeEach, describe, expect, it, vi,
} from "vitest";
import { METRIKA_COUNTER_ID, trackGoal, trackGoalOnce } from "./trackGoal";

describe("trackGoal", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    afterEach(() => {
        delete window.ym;
    });

    it("отправляет цель в счётчик сайта", () => {
        const ym = vi.fn();
        window.ym = ym;
        trackGoal("signup");
        trackGoal("checkout_start", { tariff: "volunteer_990" });
        expect(ym).toHaveBeenNthCalledWith(1, METRIKA_COUNTER_ID, "reachGoal", "signup", undefined);
        expect(ym).toHaveBeenNthCalledWith(2, METRIKA_COUNTER_ID, "reachGoal", "checkout_start", { tariff: "volunteer_990" });
    });

    it("без счётчика (стейдж, локально) ничего не делает и не падает", () => {
        expect(() => trackGoal("signup")).not.toThrow();
    });

    it("ошибка счётчика не ломает интерфейс", () => {
        window.ym = () => { throw new Error("blocked"); };
        expect(() => trackGoal("signup")).not.toThrow();
    });

    it("trackGoalOnce: одна цель на ключ за сессию", () => {
        const ym = vi.fn();
        window.ym = ym;
        trackGoalOnce("membership_paid", "p1");
        trackGoalOnce("membership_paid", "p1");
        trackGoalOnce("membership_paid", "p2");
        expect(ym).toHaveBeenCalledTimes(2);
    });
});
