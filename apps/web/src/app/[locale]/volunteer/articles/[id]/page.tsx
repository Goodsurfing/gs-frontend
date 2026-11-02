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

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.volunteerArticleEdit(locale, id), "main.sidebar.Мои статьи") : {};
}

/** Кабинет волонтёра: правка своей статьи (VolunteerArticlePersonalPage старого фронта) */
export default async function VolunteerArticleEditPage({ params }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale) || !/^\d+$/.test(id)) notFound();
    const [t, tv] = await Promise.all([getTranslator(locale), getTranslator(locale, "volunteer")]);
    return (
        <CabinetShell locale={locale} items={volunteerMenu(locale, t)} need="volunteer">
            <main className="w-full max-w-[630px]">
                <h2 className="text-[1.5em] font-bold">{tv("volunteer-create-article.Редактировать статью")}</h2>
                <VolunteerArticleEditor locale={locale} articleId={Number(id)} listHref={routes.volunteerArticles(locale)} labels={volunteerArticleLabels(tv)} />
            </main>
        </CabinetShell>
    );
}
