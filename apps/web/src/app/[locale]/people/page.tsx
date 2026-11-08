import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageBanner } from "@/components/content/PageBanner";
import { PublicShell } from "@/components/layout/PublicShell";
import { PeopleSearch } from "@/components/people/PeopleSearch";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "people");
    // Сама выдача — только для вошедших, индексировать нечего
    return pageMetadata({ locale, path: routes.people(locale), title: t("seo.title"), description: t("seo.description"), noindex: true });
}

/** «Участники»: поиск по имени (только для вошедших, без скрывших себя в «Приватности») */
export default async function PeoplePage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale, "people");
    return (
        <PublicShell locale={locale}>
            <PageBanner title={t("title")} />
            <div className="mx-auto flex max-w-[880px] flex-col gap-6 px-5 pt-10 pb-20">
                <p className="max-w-[680px] text-[17px] leading-[150%] text-ink-secondary">{t("intro")}</p>
                <PeopleSearch
                    profileTemplate={routes.volunteerPublicTemplate(locale)}
                    signInHref={routes.signIn(locale)}
                    privacyHref={routes.profilePrivacy(locale)}
                    labels={{
                        label: t("label"),
                        placeholder: t("placeholder"),
                        hint: t("hint"),
                        empty: t("empty"),
                        error: t("error"),
                        guest: t("guest"),
                        signIn: t("signIn"),
                        privacy: t("privacy"),
                    }}
                />
            </div>
        </PublicShell>
    );
}
