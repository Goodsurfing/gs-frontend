import { afterEach, describe, expect, it, vi } from "vitest";

type Ym = (id: number, method: string, goal: string, params?: unknown, callback?: () => void) => void;

const load = async (counter: string, ym?: Ym) => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_YANDEX_METRIKA_ID", counter);
    const store = new Map<string, string>();
    vi.stubGlobal("window", {
        ym,
        setTimeout: (fn: () => void, ms: number) => setTimeout(fn, ms),
        setInterval: (fn: () => void, ms: number) => setInterval(fn, ms),
        clearInterval: (id: ReturnType<typeof setInterval>) => clearInterval(id),
        sessionStorage: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v) },
    });
    return import("@/components/analytics/YandexMetrika");
};

afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

describe("цели Метрики", () => {
    it("без счётчика переход сразу, Метрика не вызывается", async () => {
        const ym = vi.fn();
        const { reachGoalThen } = await load("", ym);
        const next = vi.fn();
        reachGoalThen("checkout_start", { tariff: "x" }, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(ym).not.toHaveBeenCalled();
    });

    it("переход после ответа счётчика — один раз", async () => {
        const ym = vi.fn<Ym>((_id, _m, _g, _p, callback) => callback?.());
        const { reachGoalThen } = await load("47422282", ym);
        const next = vi.fn();
        reachGoalThen("signup", undefined, next);
        expect(ym).toHaveBeenCalledWith(47422282, "reachGoal", "signup", undefined, expect.any(Function));
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("счётчик молчит — переход через секунду", async () => {
        vi.useFakeTimers();
        const { reachGoalThen } = await load("47422282", vi.fn());
        const next = vi.fn();
        reachGoalThen("donation_start", { amount: 500 }, next);
        expect(next).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1000);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("reachGoalOnce — один раз на ключ", async () => {
        const ym = vi.fn();
        const { reachGoalOnce } = await load("47422282", ym);
        reachGoalOnce("membership_paid", "p1");
        reachGoalOnce("membership_paid", "p1");
        reachGoalOnce("membership_paid", "p2");
        expect(ym).toHaveBeenCalledTimes(2);
    });
});

describe("цели до загрузки счётчика", () => {
    it("цель при открытии страницы не теряется: ждёт скрипт и уходит после init", async () => {
        const mod = await load("47422282", undefined);
        mod.reachGoal("vacancy_view", { vacancyId: "1" });
        expect(mod.flushPendingGoals()).toBe(false);

        // скрипт счётчика выполнился: window.ym появился, init уже в его очереди
        const ym = vi.fn();
        (window as unknown as { ym: Ym }).ym = ym;
        expect(mod.flushPendingGoals()).toBe(true);
        expect(ym).toHaveBeenCalledWith(47422282, "reachGoal", "vacancy_view", { vacancyId: "1" });

        // повторно не отправляется
        mod.flushPendingGoals();
        expect(ym).toHaveBeenCalledTimes(1);
    });

    it("когда счётчик уже есть — сразу, без очереди", async () => {
        const ym = vi.fn();
        const { reachGoal } = await load("47422282", ym);
        reachGoal("donation_paid");
        expect(ym).toHaveBeenCalledWith(47422282, "reachGoal", "donation_paid", undefined);
    });

    it("переход с целью ждёт скрипт счётчика (вход сразу после VK)", async () => {
        vi.useFakeTimers();
        const mod = await load("47422282", undefined);
        const next = vi.fn();
        mod.reachGoalThen("signup", { method: "vk" }, next);
        vi.advanceTimersByTime(300);
        expect(next).not.toHaveBeenCalled();

        const ym = vi.fn<Ym>((_id, _m, _g, _p, callback) => callback?.());
        (window as unknown as { ym: Ym }).ym = ym;
        vi.advanceTimersByTime(50);
        expect(ym).toHaveBeenCalledWith(47422282, "reachGoal", "signup", { method: "vk" }, expect.any(Function));
        expect(next).toHaveBeenCalledTimes(1);
        vi.advanceTimersByTime(5000);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("счётчик так и не загрузился (блокировщик) — переход через 2,5 с", async () => {
        vi.useFakeTimers();
        const { reachGoalThen } = await load("47422282", undefined);
        const next = vi.fn();
        reachGoalThen("checkout_start", undefined, next);
        vi.advanceTimersByTime(2499);
        expect(next).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(next).toHaveBeenCalledTimes(1);
    });
});
