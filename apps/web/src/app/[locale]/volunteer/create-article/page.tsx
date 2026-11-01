import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { VolunteerArticleEditor } from "@/components/cabinet/volunteer/articles/VolunteerArticleEditor";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { routes } from "@/lib/routes";
import { volunteerArticleLabels } from "@/lib/volunteerArticleLabels";
import { volunteerMenu } from "@/lib/volunteerMenu";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.createArticle(locale), "main.sidebar.Написать в блог") : {};
}

/** Кабинет волонтёра: «Написать в блог» (VolunteerCreateArticlePage старого фронта) */
export default async function VolunteerCreateArticlePage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tv] = await Promise.all([getTranslator(locale), getTranslator(locale, "volunteer")]);
    return (
        <CabinetShell locale={locale} items={volunteerMenu(locale, t)} need="volunteer">
            <main className="w-full max-w-[630px]">
                <h2 className="text-[1.5em] font-bold">{tv("volunteer-create-article.Написать в блог")}</h2>
                <VolunteerArticleEditor locale={locale} listHref={routes.volunteerArticles(locale)} labels={volunteerArticleLabels(tv)} />
            </main>
        </CabinetShell>
    );
}
