import { describe, it, expect } from "vitest";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import { getMissingCoverImageToast } from "./getMissingCoverImageToast";

const t = (key: string, opts?: Record<string, unknown>) => (opts?.defaultValue as string) ?? key;

/**
 * Регресс-guard для row 75: сохранение описания сбора раньше молча
 * прерывалось (return без обратной связи), если фото обложки ещё не
 * загрузилось — пользователь не понимал, почему "Сохранить" не работает.
 */
describe("getMissingCoverImageToast", () => {
    it("возвращает тост с ошибкой, если coverImage не задан", () => {
        const toast = getMissingCoverImageToast(undefined, t);

        expect(toast).toEqual({
            text: "Дождитесь загрузки фото обложки перед сохранением",
            type: HintType.Error,
        });
    });

    it("возвращает тост с ошибкой, если coverImage.id отсутствует", () => {
        const toast = getMissingCoverImageToast({}, t);

        expect(toast).toEqual({
            text: "Дождитесь загрузки фото обложки перед сохранением",
            type: HintType.Error,
        });
    });

    it("возвращает null, если coverImage.id уже есть", () => {
        const toast = getMissingCoverImageToast({ id: "cover-1" }, t);

        expect(toast).toBeNull();
    });
});
