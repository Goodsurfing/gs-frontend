import { describe, expect, it } from "vitest";

import { acceptedLines, agoText, canAct, type ClubCommand, commandNote, devicesTitle, hasSentCommands, userByEmailHref } from "../club";
import { isMenuItemActive } from "../menu";

const command = (state: ClubCommand["state"], result: string | null = null): ClubCommand => ({
    id: "1", kind: "verdict", tgId: 42, taskId: "messenger", reportId: null, value: "ok", state, result, createdAt: "24.11.2026 15:00", doneAt: null,
});

describe("клуб тестировщиков в админке", () => {
    it("команда у бота — «отправлено боту», кнопки скрыты до ответа", () => {
        expect(commandNote(command("sent"))).toEqual({ text: "отправлено боту 24.11.2026 15:00", tone: "wait" });
        expect(canAct(command("sent"))).toBe(false);
        expect(canAct(command("done"))).toBe(false);
        expect(commandNote(null)).toBeNull();
        expect(canAct(null)).toBe(true);
    });

    it("невыполненную команду можно повторить и видно, почему не вышло", () => {
        expect(commandNote(command("failed", "уже решено"))).toEqual({ text: "бот не выполнил: уже решено", tone: "error" });
        expect(canAct(command("failed"))).toBe(true);
    });

    it("список перечитывается, пока есть команды у бота", () => {
        expect(hasSentCommands([null, command("done")])).toBe(false);
        expect(hasSentCommands([null, command("sent")])).toBe(true);
    });

    it("принятые прохождения по роли и устройству — с порогом", () => {
        const lines = acceptedLines({
            accepted: [
                { role: "volunteer", device: "phone", count: 3 },
                { role: null, device: "desktop", count: 5 },
                { role: "host", device: null, count: 1 },
                { role: "host", device: "phone", count: 0 },
            ],
        }, 5);
        expect(lines).toEqual(["волонтёр · телефон: 3 из 5", "компьютер: 5 из 5", "организатор · устройство не указано: 1 из 5"]);
        expect(acceptedLines({ accepted: [{ role: null, device: "phone", count: 2 }] }, null)).toEqual(["телефон: 2"]);
    });

    it("устройства анкеты — по-русски", () => {
        expect(devicesTitle("iphone,desktop")).toBe("iPhone, компьютер");
        expect(devicesTitle(null)).toBe("");
    });

    it("давность снимка", () => {
        expect(agoText(null)).toBe("ещё не было");
        expect(agoText(0)).toBe("только что");
        expect(agoText(12)).toBe("12 мин назад");
        expect(agoText(130)).toBe("2 ч назад");
        expect(agoText(60 * 72)).toBe("3 дн назад");
    });

    it("ссылка на пользователя сайта по почте", () => {
        expect(userByEmailHref("a+b@test.ru")).toBe("/admin/users?email=a%2Bb%40test.ru");
    });

    it("в меню «Сводка клуба» активна только на своей странице", () => {
        expect(isMenuItemActive("/admin/club", "/admin/club")).toBe(true);
        expect(isMenuItemActive("/admin/club", "/admin/club/participants")).toBe(false);
        expect(isMenuItemActive("/admin/club/participants", "/ru/admin/club/participants")).toBe(true);
        expect(isMenuItemActive("/admin/users", "/admin/users/1")).toBe(true);
        expect(isMenuItemActive("/admin", "/admin/users")).toBe(false);
    });
});
