import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Регресс-guard для row 102, п.24: по явной просьбе в фидбэк-документе
 * своё сообщение должно быть слева, сообщение собеседника — справа
 * (разворот привычной конвенции мессенджеров).
 */
describe("Message — сторона своих/чужих сообщений в чате", () => {
    it(".userMessage внутри медиа-блока выровнено слева (flex-start), без row-reverse", () => {
        const scss = readFileSync(join(__dirname, "Message.module.scss"), "utf-8");
        // В файле два блока .userMessage: .messageContent.userMessage (цвет
        // фона пузыря) и позиционирующий блок внутри @media — берём последний.
        const blocks = scss.match(/(?<!\.messageContent)\.userMessage\s*{[^}]*}/g) ?? [];
        const positioningBlock = blocks.at(-1) ?? "";

        expect(positioningBlock).toMatch(/align-self:\s*flex-start/);
        expect(positioningBlock).not.toMatch(/row-reverse/);
    });

    it(".otherMessage выровнено справа (flex-end) с row-reverse", () => {
        const scss = readFileSync(join(__dirname, "Message.module.scss"), "utf-8");
        const otherMessageBlock = scss.match(/\.otherMessage\s*{[\s\S]*?\n {4}}/)?.[0] ?? "";

        expect(otherMessageBlock).toMatch(/align-self:\s*flex-end/);
        expect(otherMessageBlock).toMatch(/row-reverse/);
    });
});
