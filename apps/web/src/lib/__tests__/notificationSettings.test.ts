import { describe, expect, it } from "vitest";

import { CHANNELS, type NotificationState, toggleCell, TYPES } from "@/lib/notificationSettings";

import ru from "../../../../../public/locales/ru/translation.json";
import en from "../../../../../public/locales/en/translation.json";
import es from "../../../../../public/locales/es/translation.json";

const state: NotificationState = {
    matrix: { new_application: { email: true, telegram: true, max: true, push: true }, new_message: { email: null, telegram: true, max: true, push: true } },
    channels: { telegram: { available: true, connected: false }, max: { available: false, connected: false } },
};

describe("настройки уведомлений", () => {
    it("галочка меняется сразу и не трогает остальное", () => {
        const next = toggleCell(state, "new_application", "push", false);
        expect(next.matrix.new_application).toEqual({ email: true, telegram: true, max: true, push: false });
        expect(next.matrix.new_message).toBe(state.matrix.new_message);
        expect(state.matrix.new_application?.push).toBe(true);
    });

    it.each([["ru", ru], ["en", en], ["es", es]])("все подписи есть на %s", (_, dict) => {
        const n = (dict as { notifications: Record<string, unknown> }).notifications as { types: Record<string, string>; hints: Record<string, string>; channels: Record<string, string> };
        for (const type of TYPES) {
            expect(n.types[type]).toBeTruthy();
            expect(n.hints[type]).toBeTruthy();
        }
        for (const channel of CHANNELS) expect(n.channels[channel]).toBeTruthy();
    });
});
