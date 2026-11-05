import type { Translate } from "@/i18n/dictionary";
import { TEST_BOT } from "@/lib/testBanner";

import { TestRibbonNote } from "./TestRibbonNote";

/** Соцсети Гудсёрфинга — общий список для ленты над шапкой и подвала. */
export const SOCIAL_RIBBON_LINKS = [
    { name: "Telegram", href: "https://t.me/goodsurfing", icon: "/web/icons/social/telegram.png", round: true },
    { name: "MAX", href: "https://max.ru/goodsurfing", icon: "/web/icons/social/max.png", round: false },
    { name: "VK", href: "https://vk.com/goodsurfing", icon: "/web/icons/social/vk.png", round: true },
] as const;

const RIBBON = "flex min-h-11 flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-primary px-4 py-2";

/** Лента «Тестовая версия» (только стейдж). Сама по себе — на страницах без ленты соцсетей (вход, регистрация). */
export function TestRibbon() {
    if (!TEST_BOT) return null;
    return (
        <aside aria-label="Тестовая версия" className={RIBBON}>
            <TestRibbonNote bot={TEST_BOT} />
        </aside>
    );
}

/**
 * Лента «Подписывайтесь на наши соцсети» над шапкой (GS-187). Внешне как в
 * старом фронте: голубая плашка, белая подпись, иконки с белой обводкой.
 * На стейдже вместо призыва и иконок — «Тестовая версия» (TestRibbonNote); высота ленты
 * в обоих случаях 44 px (иконки 28 px + отступы), чтобы стенд выглядел как прод.
 */
export function SocialRibbon({ t }: { t: Translate }) {
    const caption = t("main.welcome.header.socials-cta");
    if (TEST_BOT) return <TestRibbon />;

    return (
        <aside aria-label={caption} className={RIBBON}>
            <span className="text-center text-[15px] leading-[1.3] font-semibold text-white down-sm:text-[14px]">
                {caption}
            </span>
            <ul className="m-0 flex list-none items-center gap-2.5 p-0">
                {SOCIAL_RIBBON_LINKS.map(({ name, href, icon, round }) => (
                    <li key={name}>
                        <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={name}
                            title={name}
                            className={`flex shadow-[0_0_0_2px_#fff] transition-[transform,box-shadow] duration-150
                                hover:-translate-y-px hover:shadow-[0_0_0_2px_#fff,0_2px_8px_rgba(14,29,39,0.25)]
                                focus-visible:-translate-y-px ${round ? "rounded-full" : "rounded-[22%]"}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element -- иконки 28×28, оптимизация не нужна */}
                            <img src={icon} alt="" aria-hidden width={28} height={28} className="block rounded-[inherit]" />
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
