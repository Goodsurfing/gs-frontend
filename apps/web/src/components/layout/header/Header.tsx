import type { Locale } from "@/i18n/config";
import type { Translate } from "@/i18n/dictionary";
import type { MarketingBanner } from "@/lib/marketingBanner";
import { MEMBERSHIP_PRICE_RUB } from "@/lib/membership";
import { routes } from "@/lib/routes";

import { LanguageSwitcher } from "../LanguageSwitcher";
import { AccountArea, type AccountLinks } from "./AccountArea";
import { DesktopNav } from "./DesktopNav";
import { MembershipHoverCard } from "./MembershipHoverCard";
import { MobileHeader } from "./MobileHeader";
import { buildNavigation } from "./navigation";
import { ScrollState } from "./ScrollState";

/**
 * floating — плавающая капсула (главная, лендинги); static — обычная белая
 * полоса с границей снизу (функциональные страницы, 404).
 */
export type HeaderVariant = "floating" | "static";

interface HeaderProps {
    locale: Locale;
    t: Translate;
    /** Переводы из profile.json — тексты окна «Членство» */
    tProfile: Translate;
    banner: MarketingBanner | null;
    variant?: HeaderVariant;
}

const LAYOUT: Record<HeaderVariant, { outer: string; inner: string; header: string; banner: string }> = {
    floating: {
        outer: "sticky top-2 z-50 h-0 down-2xl:top-0 down-2xl:h-auto down-2xl:bg-white",
        inner: "pointer-events-none mx-4 pt-2 down-2xl:mx-0 down-2xl:pt-0",
        header: "h-[60px] rounded-[10px] border border-white/60 bg-white/78 shadow-[0_8px_24px_rgba(14,29,39,0.12),0_1px_0_rgba(255,255,255,0.7)_inset] backdrop-blur-[16px] backdrop-saturate-[1.6] transition-[background-color,box-shadow] duration-200 [[data-scrolled]_&]:bg-white/94 [[data-scrolled]_&]:shadow-[0_12px_32px_rgba(14,29,39,0.16)]",
        banner: "rounded-b-[10px] down-2xl:rounded-none",
    },
    static: {
        outer: "sticky top-0 z-50 border-b border-accent-bg bg-white",
        inner: "",
        header: "mx-auto h-16 max-w-[1360px]",
        banner: "",
    },
};

/**
 * Шапка публичных страниц (как MainHeader старого фронта). Пока только для
 * гостя: профиль, сообщения и язык из профиля появятся со входом через cookie
 * (GS-218).
 *
 * Шире 1280 px — плавающая капсула: под лентой соцсетей, при прокрутке
 * прилипает в 16 px от верха. Это делает sticky-обёртка нулевой высоты (top 8 px
 * + отступ 8 px) без скриптов — в старом фронте позицию считал JS на каждый
 * scroll. Уже — обычная белая полоса, прилипающая к верху.
 */
export function Header({ locale, t, tProfile, banner, variant = "floating" }: HeaderProps) {
    const layout = LAYOUT[variant];
    const navigation = buildNavigation(locale, t);
    const membershipLabel = t("main.welcome.header.membership");
    const signIn = { label: t("main.welcome.header.sign-in"), href: routes.signIn(locale) };
    const offerText = (key: string, price: number) => tProfile(`info.${key}`, { price });
    const h = (key: string) => t(`main.welcome.header.${key}`);
    // {{date}} остаётся в тексте — подставляется в браузере по данным членства
    const keepDate = { date: "{{date}}" };
    const account: AccountLinks = {
        myPage: { label: h("my-page"), href: routes.volunteerPublicTemplate(locale) },
        aboutMe: { label: h("about-me"), href: routes.profileInfo(locale) },
        hostDashboard: { label: h("host-dashboard"), href: routes.hostDashboard(locale) },
        volunteerDashboard: { label: h("volunteer-dashboard"), href: routes.volunteerDashboard(locale) },
        messages: { label: h("messages"), href: routes.messenger(locale) },
        exit: h("exit"),
    };

    return (
        <div className={layout.outer}>
            {variant === "floating" && <ScrollState />}
            {/* data-site-header: по нижней границе прилипают меню разделов (вакансия и др.) */}
            <div data-site-header className={layout.inner}>
                {banner && (
                    <a
                        href={banner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`pointer-events-auto flex w-full flex-wrap items-center justify-center gap-3 bg-cta px-5 py-2.5 no-underline transition-colors duration-150 hover:bg-cta-deep down-2xl:gap-1.5 down-2xl:px-4 ${layout.banner}`}
                    >
                        <span className="text-center text-[14px] leading-[1.4] font-semibold text-white down-2xl:text-[13px]">
                            {banner.description}
                        </span>
                        <span className="shrink-0 text-[14px] font-bold whitespace-nowrap text-white underline down-2xl:text-[13px]">
                            {t("Подробнее")}
                            {" →"}
                        </span>
                    </a>
                )}
                <header className={`pointer-events-auto flex items-center justify-between gap-4 px-5 down-3xl:gap-3 down-3xl:px-3 down-2xl:hidden ${layout.header}`}>
                    <div className="flex shrink-0 items-center gap-3">
                        <a href={routes.main(locale)} className="flex items-center">
                            {/* eslint-disable-next-line @next/next/no-img-element -- svg-логотип */}
                            <img src="/web/icons/header/logo.svg" alt="GoodSurfing" width={152} height={36} className="block h-9 w-auto" />
                        </a>
                    </div>
                    <nav aria-label={t("main.welcome.header.menu")} className="flex min-w-0 flex-1 justify-center">
                        <DesktopNav navigation={navigation} />
                    </nav>
                    <div className="flex shrink-0 items-center gap-3">
                        <MembershipHoverCard
                            label={membershipLabel}
                            href={routes.membership(locale)}
                            offers={[
                                {
                                    tone: "volunteer",
                                    label: tProfile("info.Волонтёрам"),
                                    text: offerText("Получи возможность оставлять неограниченное количество откликов и путешествовать без лимитов — {{price}} руб/год", MEMBERSHIP_PRICE_RUB.volunteer),
                                    cta: tProfile("info.Оформить членство"),
                                    href: routes.membership(locale),
                                },
                                {
                                    tone: "host",
                                    label: tProfile("info.Организаторам"),
                                    text: offerText("Создавай неограниченное количество вакансий и получи больше возможностей для своего проекта — {{price}} руб/год", MEMBERSHIP_PRICE_RUB.host),
                                    cta: tProfile("info.Оформить членство"),
                                    href: `${routes.membership(locale)}#host`,
                                },
                            ]}
                            texts={{
                                activeUntil: tProfile("info.Членство активно до {{date}}", keepDate),
                                renew: tProfile("info.Продлить членство"),
                                internationalUntil: tProfile("info.Международный клуб — активно до {{date}}", keepDate),
                                internationalRenew: tProfile("info.Продлить участие"),
                            }}
                        />
                        <LanguageSwitcher locale={locale} label={t("Язык")} />
                        <AccountArea signIn={signIn} links={account} />
                    </div>
                </header>
                <MobileHeader
                    locale={locale}
                    homeHref={routes.main(locale)}
                    navigation={navigation}
                    membership={{
                        label: membershipLabel,
                        href: routes.membership(locale),
                        hint: t("main.welcome.header.membership-from", { price: MEMBERSHIP_PRICE_RUB.volunteer }),
                        activeHint: t("main.welcome.header.membership-active", keepDate),
                    }}
                    signIn={signIn}
                    // В мобильном меню «Моя страница» ведёт в кабинет, как в старом фронте
                    account={{
                        links: [
                            { label: h("my-page"), href: routes.profileInfo(locale) },
                            account.messages,
                            account.hostDashboard,
                            account.volunteerDashboard,
                        ],
                        exit: account.exit,
                    }}
                    labels={{ menu: t("main.welcome.header.menu"), language: t("Язык") }}
                />
            </div>
        </div>
    );
}
