import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RequireUser } from "@/components/cabinet/RequireUser";
import { PublicShell } from "@/components/layout/PublicShell";
import { StartSteps } from "@/components/start/StartSteps";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "start");
    return pageMetadata({ locale, path: routes.start(locale), title: `${t("title")} — GoodSurfing`, description: t("text"), noindex: true });
}

/** «С чего начать» — после входа, если некуда вернуться (06.11.2026) */
export default async function StartPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale, "start");
    const step = (key: string) => ({ title: t(`${key}.title`), why: t(`${key}.why`), action: t(`${key}.action`) });
    return (
        <PublicShell locale={locale} topGap>
            <RequireUser locale={locale} />
            <StartSteps
                hrefs={{
                    home: routes.main(locale),
                    catalog: `${routes.offersMap(locale)}?sort=popularity`,
                    profile: routes.profileInfo(locale),
                    preferences: routes.profilePreferences(locale),
                    volunteerDashboard: routes.volunteerDashboard(locale),
                    hostDashboard: routes.hostDashboard(locale),
                    hostRegister: routes.hostRegister(locale),
                }}
                labels={{
                    title: t("title"),
                    text: t("text"),
                    done: t("done"),
                    skip: t("skip"),
                    host: t("host"),
                    steps: { apply: step("apply"), intro: step("intro"), directions: step("directions") },
                }}
            />
        </PublicShell>
    );
}
