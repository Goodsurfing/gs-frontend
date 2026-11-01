import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { VolunteerArticles } from "@/components/cabinet/volunteer/articles/VolunteerArticles";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { routes } from "@/lib/routes";
import { volunteerMenu } from "@/lib/volunteerMenu";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.volunteerArticles(locale), "main.sidebar.Мои статьи") : {};
}

/** Кабинет волонтёра: «Мои статьи» (VolunteerArticlesPage старого фронта) */
export default async function VolunteerArticlesPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tv] = await Promise.all([getTranslator(locale), getTranslator(locale, "volunteer")]);
    const a = (key: string) => tv(`volunteer-articles.${key}`);
    return (
        <CabinetShell locale={locale} items={volunteerMenu(locale, t)} need="volunteer">
            <main className="min-h-[50vh] w-full">
                <h2 className="text-[1.5em] font-bold">{a("Мои статьи")}</h2>
                <VolunteerArticles
                    hrefs={{
                        article: routes.blogArticle(locale, "{slug}"),
                        edit: routes.volunteerArticleEdit(locale, "{id}"),
                        create: routes.createArticle(locale),
                    }}
                    labels={{
                        drafts: a("Черновики"),
                        edit: a("Редактировать"),
                        publish: a("Опубликовать"),
                        remove: a("Удалить"),
                        // В старом фронте у кнопки «⋯» подписи не было
                        actions: a("Редактировать"),
                        deleted: a("Статья удалена"),
                        deleteError: a("Ошибка удаления статьи"),
                        published: a("Статья опубликована"),
                        publishError: a("Ошибка публикации статьи"),
                        empty: a("На данный момент у вас нет добавленных статей. Создайте свою первую статью"),
                        create: a("Создать статью"),
                        pagination: { prev: t("pagination.prev"), next: t("pagination.next"), page: t("pagination.label") },
                    }}
                />
            </main>
        </CabinetShell>
    );
}
