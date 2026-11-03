import { describe, expect, it, vi } from "vitest";

import { muteVkStatsErrors } from "../vkStatsGuard";

describe("muteVkStatsErrors", () => {
    it("сбой статистики VK отвечает пустым JSON (SDK вызывает .json()), остальные ошибки сети проходят", async () => {
        const target = { fetch: vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))) as unknown as typeof fetch };
        muteVkStatsErrors(target);

        const stats = await target.fetch("https://id.vk.ru/stat_events_vkid_sdk?app_id=1");
        expect(stats.ok).toBe(true);
        await expect(stats.json()).resolves.toEqual({});
        await expect(target.fetch("https://api.goodsurfing.org/api/v1/profile")).rejects.toThrow("Failed to fetch");
    });

    it("не оборачивает fetch повторно", () => {
        const target = { fetch: vi.fn() as unknown as typeof fetch };
        muteVkStatsErrors(target);
        const once = target.fetch;
        muteVkStatsErrors(target);
        expect(target.fetch).toBe(once);
    });
});
