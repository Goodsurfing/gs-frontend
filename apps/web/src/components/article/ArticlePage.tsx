import type { Metadata } from "next";

import { NotFound } from "@/components/NotFound";
import { PublicShell } from "@/components/layout/PublicShell";
import { VideoEmbed } from "@/components/video/VideoEmbed";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import type { ArticleKind } from "@/lib/articleActions";
import { calameoEmbed, getArticle } from "@/lib/articleDetail";
import { mediaUrl } from "@/lib/media";
import { routes } from "@/lib/routes";
import { pageMetadata, seoDescription, siteUrl } from "@/lib/seo";

import { ArticleDetail } from "./ArticleDetail";

// Словарь, раздел списка и адрес — по виду материала
const KIND = {
    news: { ns: "news", crumb: ["news", "Новости"], list: routes.news, path: (l: Locale, id: string) => `${routes.news(l)}/${id}` },
    blog: { ns: "blog", crumb: ["blog", "Блог"], list: routes.blog, path: (l: Locale, id: string) => routes.blogArticle(l, id) },
    journal: { ns: "journals", crumb: ["journals", "Журналы"], list: routes.journals, path: (l: Locale, id: string) => `${routes.journals(l)}/${id}` },
    video: { ns: "video", crumb: ["translation", "Видео"], list: routes.video, path: (l: Locale, id: string) => `${routes.video(l)}/${id}` },
} as const;

// Общие поля четырёх схем (новость, статья, журнал, видео), которые рисует страница
type Loaded = {
    id: string | number;
    slug?: string | null;
    name: string;
    created: string;
    likeCount: number;
    reviewCount: number;
    description?: string | null;
    url?: string | null;
    image?: { contentUrl?: string | null } | null;
    category?: { name: string; color: string } | null;
    categoryResult?: { name: string; color: string } | null;
    blogCategoryResults?: { name: string; color: string }[] | null;
    author?: { id?: string; firstName?: string | null; lastName?: string | null; image?: { contentUrl?: string | null; thumbnails?: unknown } | null } | null;
};

export async function articleMetadata(kind: ArticleKind, locale: Locale, idOrSlug: string): Promise<Metadata> {
    const config = KIND[kind];
    const [data, t] = await Promise.all([getArticle(kind, locale, idOrSlug) as Promise<Loaded | null>, getTranslator(locale, config.ns)]);
    if (!data) return pageMetadata({ locale, path: config.path(locale, idOrSlug), title: t("seo.title"), description: t("seo.description"), noindex: true });
    const meta = pageMetadata({
        locale,
        // Канонический адрес — по slug, даже если пришли по старой ссылке с id
        path: config.path(locale, data.slug ?? String(data.id)),
        title: data.name || t("seo.title"),
        description: (data.description && seoDescription(data.description)) || t("seo.description"),
        image: mediaUrl(data.image),
        type: "article",
    });
    const tag = data.category?.name ?? data.categoryResult?.name;
    return kind === "blog" ? meta : { ...meta, keywords: [data.name, tag, t("seo.keywords")].filter(Boolean).join(", ") };
}

/** Страница новости, статьи блога, журнала или видео (GS-219) */
export async function ArticlePage({ kind, locale, idOrSlug }: { kind: ArticleKind; locale: Locale; idOrSlug: string }) {
    const config = KIND[kind];
    const [data, t, tSection, tOffer] = await Promise.all([
        getArticle(kind, locale, idOrSlug) as Promise<Loaded | null>,
        getTranslator(locale),
        getTranslator(locale, config.crumb[0]),
        getTranslator(locale, "offer"),
    ]);
    // Журнал в старом фронте — с плавающей шапкой, остальные — со статичной
    const header = kind === "journal" ? "floating" : "static";
    if (!data) {
        return <PublicShell locale={locale} headerVariant={header}><NotFound locale={locale} t={t} /></PublicShell>;
    }
    const tNs = await getTranslator(locale, config.ns);
    const tags = data.blogCategoryResults?.length ? data.blogCategoryResults
        : data.category ? [data.category]
            : data.categoryResult ? [data.categoryResult] : [];
    const author = kind === "blog" && data.author?.id ? {
        name: `${data.author.firstName || ""} ${data.author.lastName || ""}`.trim() || t("Анонимный пользователь"),
        avatar: mediaUrl(data.author.image, "small"),
        href: routes.volunteerPublic(locale, data.author.id),
    } : undefined;
    const empty = kind === "journal" ? `<p>${tNs("Данная статья пустая")}</p>` : "<p>Данная статья пустая</p>";
    const calameo = kind === "journal" ? calameoEmbed(data.url) : null;
    const media = kind === "video" && data.url ? (
        <div className="flex justify-center"><div className="w-[750px] max-w-full"><VideoEmbed url={data.url} height={424} title={data.name} unsupported={t("Неподдерживаемая ссылка на видео")} /></div></div>
    ) : calameo ? <iframe src={calameo} title={data.name} width="100%" height="500px" allowFullScreen loading="lazy" className="box-content inline border-2 align-baseline [border-style:inset]" /> : undefined;

    return (
        <PublicShell locale={locale} headerVariant={header} topGap={header === "floating"}>
            <ArticleDetail
                kind={kind}
                id={String(data.id)}
                breadcrumbs={[{ name: tSection(config.crumb[1]), href: config.list(locale) }, { name: data.name }]}
                title={data.name}
                author={author}
                date={data.created}
                tags={tags}
                likes={data.likeCount}
                reviews={data.reviewCount}
                html={kind === "video" ? null : data.description || empty}
                media={media}
                shareUrl={`${siteUrl()}${config.path(locale, data.slug ?? String(data.id))}`}
                volunteerHref={routes.volunteerPublicTemplate(locale)}
                labels={{
                    loginToLike: tNs("Чтобы поставить лайк, нужно авторизоваться"),
                    loginToComment: tNs("Чтобы оставить комментарий, нужно авторизоваться"),
                    error: tNs("Произошла ошибка"),
                    loadError: tNs("Произошла ошибка при подгрузке комментариев"),
                    comments: t("комментариев"),
                    write: t("Написать комментарий"),
                    showNext: tOffer("personalOffer.Посмотреть следующие"),
                    anonymous: t("Анонимный пользователь"),
                    share: t("Поделиться"),
                    shareTitle: t("Статья"),
                }}
            />
        </PublicShell>
    );
}
