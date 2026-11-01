import { NavAnchor } from "@/components/ui/NavAnchor";
import type { Locale } from "@/i18n/config";
import type { Translate } from "@/i18n/dictionary";
import { EXPEDITIONS_URL, PUBLIC_OFFER_PDF, routes } from "@/lib/routes";

import { LanguageSwitcher } from "./LanguageSwitcher";

const FOOTER_SOCIALS = [
    { name: "Telegram", href: "https://telegram.me/goodsurfing", icon: "/web/icons/footer/telegram.svg" },
    { name: "VK", href: "https://vk.com/goodsurfing", icon: "/web/icons/footer/vk.svg" },
    { name: "YouTube", href: "https://www.youtube.com/@goodsurfing", icon: "/web/icons/footer/youtube.svg" },
    { name: "MAX", href: "https://max.ru/goodsurfing", icon: "/web/icons/footer/max.svg" },
] as const;

type FooterLink = { label: string; href: string; external?: boolean };

const linkClass = "text-[12px] leading-[167%] font-medium text-[#82949F] underline aria-[current=page]:no-underline";
const copyrightLinkClass = "text-[14px] leading-[171%] font-medium text-[#82949F] underline hover:text-white aria-[current=page]:no-underline aria-[current=page]:hover:text-[#82949F]";

/**
 * Подвал. Внешне — как в старом фронте (widgets/Footer): тёмный фон, логотип и
 * язык слева, соцсети, четыре колонки ссылок, строка копирайта.
 */
export function Footer({ locale, t }: { locale: Locale; t: Translate }) {
    const h = "main.welcome.header";
    const columns: { title: string; links: FooterLink[] }[] = [
        {
            title: t(`${h}.community.title`),
            links: [
                { label: t(`${h}.community.blog`), href: routes.blog(locale) },
                { label: t(`${h}.community.video`), href: routes.video(locale) },
                { label: t(`${h}.community.ambassadors`), href: routes.ambassadors(locale) },
                { label: t(`${h}.community.courses`), href: routes.academy(locale) },
                { label: t(`${h}.expeditions`), href: EXPEDITIONS_URL, external: true },
            ],
        },
        {
            title: t(`${h}.about-project.title`),
            links: [
                { label: t(`${h}.about-project.about-npo`), href: routes.npo(locale) },
                { label: t(`${h}.about-project.our-team`), href: routes.ourTeam(locale) },
                { label: t(`${h}.about-project.how-it-works`), href: routes.membership(locale) },
                { label: t(`${h}.about-project.rules`), href: routes.rules(locale) },
                { label: t(`${h}.about-project.privacy-policy`), href: routes.privacyPolicy(locale) },
                { label: t(`${h}.about-project.news`), href: routes.news(locale) },
                { label: t(`${h}.about-project.about-goodsurfing`), href: routes.aboutProject(locale) },
                { label: t(`${h}.about-project.find-job`), href: routes.findJob(locale) },
                { label: t(`${h}.about-project.feedback`), href: routes.feedback(locale) },
            ],
        },
        {
            title: t(`${h}.for-organizers.title`),
            links: [
                { label: t(`${h}.for-organizers.become-a-host`), href: routes.becomeHost(locale) },
            ],
        },
        {
            title: t(`${h}.donation.title`),
            links: [
                { label: t(`${h}.donation.support-goodsurfing`), href: routes.membership(locale) },
                { label: t(`${h}.donation.public-reports`), href: routes.npo(locale) },
                { label: t(`${h}.donation.public-offer`), href: PUBLIC_OFFER_PDF, external: true },
                { label: t(`${h}.donation.payment-security-policy`), href: routes.paymentSecurityPolicy(locale) },
            ],
        },
    ];

    return (
        <>
            <footer className="flex justify-center bg-ink pt-[50px] pb-[25px]">
                <div className="flex w-full max-w-[1150px] justify-between down-xl:w-[992px] down-lg:w-[768px]
                    down-md:w-[480px] down-md:flex-col down-md:items-center down-xs:w-[320px]"
                >
                    <div className="flex flex-1 flex-col down-md:mb-10 down-md:items-center">
                        <div className="flex items-center down-md:justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element -- svg-логотип */}
                            <img src="/web/icons/footer/logo.svg" alt="GoodSurfing" className="mr-10 down-md:mr-0" />
                            <div className="down-md:hidden">
                                <LanguageSwitcher locale={locale} label={t("Язык")} />
                            </div>
                        </div>
                        <div className="mt-10 mb-[15px] flex items-center down-md:justify-between">
                            {FOOTER_SOCIALS.map(({ name, href, icon }) => (
                                <a
                                    key={name}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mr-4 down-md:last:mr-0"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element -- svg-иконка */}
                                    <img src={icon} alt={name} />
                                </a>
                            ))}
                        </div>
                    </div>
                    <nav className="flex flex-[2] justify-between down-md:w-full down-md:text-center down-xs:flex-col">
                        {columns.map(({ title, links }) => (
                            <div key={title} className="flex flex-col down-xs:mb-[30px]">
                                <h4 className="mb-[25px] text-[18px] leading-[122%] font-medium text-white">{title}</h4>
                                <div className="flex flex-col">
                                    {links.map(({ label, href, external }) => (
                                        <NavAnchor
                                            key={href + label}
                                            href={href}
                                            className={linkClass}
                                            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                                        >
                                            {label}
                                        </NavAnchor>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>
            </footer>
            <div className="flex items-center justify-center gap-6 border-t-[0.5px] border-[#8494A1] bg-ink pt-[15px] pb-10
                down-xs:flex-col down-xs:gap-2"
            >
                <p className="text-[14px] leading-[171%] font-medium text-[#82949F]">
                    © GoodSurfing, 2017-
                    {new Date().getFullYear()}
                </p>
                <div className="flex gap-4">
                    <NavAnchor className={copyrightLinkClass} href={routes.rules(locale)}>{t(`${h}.about-project.rules`)}</NavAnchor>
                    <NavAnchor className={copyrightLinkClass} href={routes.privacyPolicy(locale)}>{t(`${h}.about-project.privacy-policy`)}</NavAnchor>
                </div>
            </div>
        </>
    );
}
