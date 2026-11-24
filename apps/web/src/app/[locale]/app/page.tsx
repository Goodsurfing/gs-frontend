import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { AppInstallState } from "@/components/pwa/AppInstallState";
import { InstallSteps } from "@/components/pwa/InstallSteps";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { installStepsLabels } from "@/lib/pwaLabels";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "pwa");
    return pageMetadata({ locale, path: routes.app(locale), title: `${t("page.title")} — GoodSurfing`, description: t("page.description") });
}

/** Магазины приложений Android — пока «скоро» (приложение в сторы не опубликовано) */
const STORES = ["RuStore", "Google Play"] as const;

/**
 * «Гудсёрфинг на телефоне» (решение владельца 24.11.2026): Android — приложение
 * в RuStore и Google Play (пока «скоро»), iPhone — сайт на экране «Домой»: так
 * приходят уведомления, а членство оплачивается на сайте, как обычно.
 */
export default async function AppPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale, "pwa");
    const section = "flex flex-col gap-4 rounded-[16px] border border-accent-bg bg-white px-6 py-6 down-sm:px-4";
    return (
        <PublicShell locale={locale} topGap>
            <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6 px-4 py-10 down-md:py-6">
                <header className="flex flex-col gap-3">
                    <h1 className="text-[32px] font-bold leading-[120%] text-ink down-sm:text-[26px]">{t("page.title")}</h1>
                    <p className="text-[16px] leading-[150%] text-ink-tertiary">{t("page.lead")}</p>
                </header>
                <AppInstallState messengerHref={routes.messenger(locale)} labels={{ installed: t("page.installed"), notSafari: t("page.notSafari"), messenger: t("page.messenger") }} />
                <section id="iphone" aria-labelledby="app-iphone" className={section}>
                    <h2 id="app-iphone" className="text-[22px] font-semibold text-ink">{t("page.iphoneTitle")}</h2>
                    <p className="text-[15px] leading-[150%] text-ink-tertiary">{t("page.iphoneText")}</p>
                    <InstallSteps labels={installStepsLabels(t)} />
                    <p className="text-[13px] leading-[140%] text-caption">{t("hint.note")}</p>
                </section>
                <section id="android" aria-labelledby="app-android" className={section}>
                    <h2 id="app-android" className="text-[22px] font-semibold text-ink">{t("page.androidTitle")}</h2>
                    <p className="text-[15px] leading-[150%] text-ink-tertiary">{t("page.androidText")}</p>
                    <ul className="flex flex-wrap gap-3">
                        {STORES.map((store) => (
                            <li key={store} className="flex h-12 items-center gap-2 rounded-[10px] border border-accent-bg bg-accent-bg/30 px-4 text-[15px] text-ink-tertiary">
                                <span className="font-semibold">{store}</span>
                                <span className="rounded-full bg-white px-2 py-0.5 text-[12px] text-caption">{t("page.soon")}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </PublicShell>
    );
}
