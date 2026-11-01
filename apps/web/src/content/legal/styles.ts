import type { ReactNode } from "react";

/**
 * Оформление текстов юридических страниц. Старый фронт полагался на стили
 * браузера по умолчанию (h2 — 1.5em жирный, маркеры у списков), preflight
 * Tailwind их обнуляет — поэтому значения заданы явно, как на старом сайте.
 */
// scroll-mt — переход из меню останавливается на 100 px выше раздела, под шапкой
export const SECTION = "flex scroll-mt-[100px] flex-col gap-5";
export const TITLE = "text-[24px] font-bold";
export const SUBTITLE = "my-2.5 text-[18px] font-bold";
export const BULLETS = "ml-[1.325rem] list-disc py-2.5";
export const NUMBERED = "ml-[1.325rem] list-decimal py-2.5";

export type LegalDocument = {
    /** Вводный блок над текстом (у правил — «Условия использования Goodsurfing») */
    intro?: { title: string; text: string };
    /** Пункты бокового меню; id совпадают с id разделов в body */
    menu: { id: string; title: string }[];
    body: ReactNode;
};
