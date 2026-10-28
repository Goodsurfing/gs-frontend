import type { Translate } from "@/i18n/dictionary";

/** Соцсети Гудсёрфинга — общий список для ленты над шапкой и подвала. */
export const SOCIAL_RIBBON_LINKS = [
    { name: "Telegram", href: "https://t.me/goodsurfing", icon: "/icons/social/telegram.png", round: true },
    { name: "MAX", href: "https://max.ru/goodsurfing", icon: "/icons/social/max.png", round: false },
    { name: "VK", href: "https://vk.com/goodsurfing", icon: "/icons/social/vk.png", round: true },
] as const;

/**
 * Лента «Подписывайтесь на наши соцсети» над шапкой (GS-187). Внешне как в
 * старом фронте: голубая плашка, белая подпись, иконки с белой обводкой.
 */
export function SocialRibbon({ t }: { t: Translate }) {
    const caption = t("main.welcome.header.socials-cta");

    return (
        <aside
            aria-label={caption}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-primary px-4 py-2"
        >
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
