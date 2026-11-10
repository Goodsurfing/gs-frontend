import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { OfferActions, type OfferActionsHrefs, type OfferActionsLabels } from "@/components/offer/OfferActions";
import { OfferAddressMap } from "@/components/offer/OfferAddressMap";
import { OfferDatesPassed } from "@/components/offer/OfferDatesPassed";
import { OfferHero } from "@/components/offer/OfferHero";
import { OfferOrganization } from "@/components/offer/OfferOrganization";
import { OfferParticipants } from "@/components/offer/OfferParticipants";
import { OfferPhotoStack } from "@/components/offer/OfferPhotoStack";
import { OfferReviews } from "@/components/offer/OfferReviews";
import {
    OfferDescription, OfferExtraConditions, OfferFinishing, OfferLanguages, OfferPayment, OfferTerms,
    OfferWhatToDo, OfferWhen, OfferWhoNeeds, type SvgMap,
} from "@/components/offer/OfferSections";
import { OfferShare } from "@/components/offer/OfferShare";
import { OfferViewerProvider } from "@/components/offer/OfferViewer";
import { SectionTitle } from "@/components/offer/parts";
import { GalleryCarousel } from "@/components/gallery/GalleryCarousel";
import { HistoryBack } from "@/components/ui/HistoryBack";
import { SectionSubmenu } from "@/components/ui/SectionSubmenu";
import { failOnApiError } from "@/lib/apiUnavailable";
import { isLocale, type Locale } from "@/i18n/config";
import { getTranslator, type Translate } from "@/i18n/dictionary";
import { offerSeoDescription, offerSeoTitle } from "@/lib/offerSeo";
import { categoryName } from "@/lib/categories";
import { mediaUrl } from "@/lib/media";
import { getPrices, TARIFF } from "@/lib/membershipPrices";
import { getOffer, getOfferBanner, getOfferParticipants, getOfferReviews, getSimilarOffers, inlineSvg, localizedDescription, type OfferDetail, type SimilarOffer } from "@/lib/offer";
import { type Badge, getOrganizationBadges } from "@/lib/achievements";
import { organizationType, PARTICIPATE_STATES, responseStatsText } from "@/lib/offerText";
import { routes } from "@/lib/routes";
import { offerHighlights } from "@/lib/offerHighlights";
import { pageMetadata, siteUrl } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; id: string }> };

export const revalidate = 300;

/**
 * Кэш страницы (ISR): без generateStaticParams страница с параметром в адресе
 * рендерилась на каждый показ (cache-control: no-store), и обход поисковиком
 * пачкой страниц грузил процессор (04.11 — до 7 с на страницу). Пустой список:
 * при сборке ничего не готовим, каждая страница рендерится при первом заходе
 * и отдаётся из кэша, обновляясь раз в revalidate секунд. Личное (откликнуться,
 * редактировать) браузер дозапрашивает сам — в кэше только общие данные.
 */
export function generateStaticParams() {
    return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    if (!isLocale(locale)) return {};
    const [result, tMain, tOffer] = await Promise.all([getOffer(locale, id), getTranslator(locale, "main"), getTranslator(locale, "offer")]);
    const path = routes.offer(locale, id);
    if (result.kind !== "ok") {
        return pageMetadata({ locale, path, title: tMain("seo.title"), description: tMain("seo.description"), noindex: true });
    }
    const { description } = localizedDescription(result.offer);
    const offer = result.offer;
    // Название — как написал организатор; для поиска к нему добавляются «волонтёрство», регион и условия
    const seo = description?.title ? {
        title: description.title,
        address: offer.where?.address,
        category: description.categories?.[0]?.name,
        highlights: offerHighlights({ condition: offer.condition, whatToDo: offer.whatToDo, when: offer.when }, tOffer),
        shortDescription: description.shortDescription || description.description,
    } : null;
    return pageMetadata({
        locale,
        path,
        title: seo ? offerSeoTitle(seo, locale) : tMain("seo.title"),
        description: seo ? offerSeoDescription(seo) : tMain("seo.description"),
        // Карточка для соцсетей: обложка + название, регион, условия (/offers/:id/card)
        image: description?.title ? `${siteUrl()}${path}/card` : mediaUrl(description?.image),
        noindex: result.offer.status === "draft",
    });
}

/** Сообщение вместо вакансии (не найдена, ошибка, черновик) — как в старом фронте */
function OfferMessage({ text, back }: { text: string; back?: string }) {
    return (
        <div className="mx-auto flex min-h-[500px] w-full max-w-[1920px] flex-col items-center justify-center px-[50px] pt-[100px] pb-[50px] down-lg:p-5">
            <p className="mb-4 flex justify-center text-[14px] leading-[1.2] font-medium">{text}</p>
            {back && <HistoryBack label={back} className="cursor-pointer rounded-[8px] bg-primary px-6 py-2.5 text-[1rem] text-white" />}
        </div>
    );
}

/** Иконки справочников с API (навыки, жильё, питание, проезд) — вставляются в разметку */
async function referenceIcons(offer: OfferDetail): Promise<SvgMap> {
    const urls = [
        ...(offer.whatToDo?.skills ?? []),
        ...(offer.condition?.houses ?? []),
        ...(offer.condition?.foods ?? []),
        ...(offer.condition?.transfers ?? []),
    ].map((item) => item.image?.contentUrl).filter((url): url is string => !!url);
    const unique = [...new Set(urls)];
    const svgs = await Promise.all(unique.map(inlineSvg));
    return Object.fromEntries(unique.map((url, index) => [url, svgs[index] ?? null]));
}

function actionsLabels(t: Translate, price: number): OfferActionsLabels {
    return {
        participate: t("personalOffer.Участвовать"),
        closed: t("personalOffer.vacancyClosed"),
        becomeVolunteer: t("personalOffer.Чтобы участвовать, станьте гудсёрфером"),
        states: Object.fromEntries(PARTICIPATE_STATES.map((state) => [state, t(`personalOffer.${state}`)])),
        edit: t("personalOffer.Редактировать"),
        upsell: {
            title: t("personalOffer.Бесплатные отклики на этот год закончились"),
            text: t("personalOffer.Членство — {{price}} ₽ на год: отклики без ограничений", { price }),
            button: t("personalOffer.Оформить членство"),
        },
    };
}

/** Страница вакансии (OfferPersonalPage старого фронта, GS-219) */
export default async function OfferPage({ params }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const [result, t, tOffer, tMain, tHost] = await Promise.all([
        getOffer(locale, id),
        getTranslator(locale),
        getTranslator(locale, "offer"),
        getTranslator(locale, "main"),
        getTranslator(locale, "host"),
    ]);

    failOnApiError(result, `вакансия ${id}`);
    if (result.kind !== "ok") {
        return (
            <PublicShell locale={locale} headerVariant="static">
                <OfferMessage text={tMain("Вакансия не найдена или произошла ошибка")} back={tMain("Назад")} />
            </PublicShell>
        );
    }
    const offer = result.offer;
    if (offer.status === "draft") {
        return (
            <PublicShell locale={locale}>
                <OfferMessage text={tMain("Вакансия не опубликована")} />
            </PublicShell>
        );
    }

    const [participants, reviews, banner, svgs, prices, badges, similar] = await Promise.all([
        getOfferParticipants(locale, id),
        getOfferReviews(locale, id),
        getOfferBanner(locale),
        referenceIcons(offer),
        // Цена членства — в предложении, когда кончились бесплатные отклики
        getPrices(locale),
        getOrganizationBadges(locale, offer.organization.id),
        // Даты прошли (GS-277) — похожие актуальные; иначе запрос не нужен
        offer.datesPassed ? getSimilarOffers(locale, offer.id) : Promise.resolve([]),
    ]);
    return (
        <PublicShell locale={locale}>
            <OfferViewerProvider offerId={offer.id}>
                <div className="mx-auto flex min-h-[500px] w-full max-w-[1920px] flex-col items-center justify-center px-[50px] pt-[100px] pb-[50px] down-lg:p-5">
                    <OfferBody locale={locale} offer={offer} participants={participants} reviews={reviews} banner={banner} svgs={svgs} badges={badges} similar={similar} volunteerPrice={prices[TARIFF.volunteer] ?? 990} t={t} tOffer={tOffer} tHost={tHost} />
                </div>
            </OfferViewerProvider>
        </PublicShell>
    );
}

function OfferBody({ locale, offer, participants, reviews, banner, svgs, badges, similar, volunteerPrice, t, tOffer, tHost }: {
    locale: Locale;
    offer: OfferDetail;
    participants: Awaited<ReturnType<typeof getOfferParticipants>>;
    reviews: Awaited<ReturnType<typeof getOfferReviews>>;
    banner: Awaited<ReturnType<typeof getOfferBanner>>;
    svgs: SvgMap;
    /** Значки организации — в блоке «Организация» */
    badges: Badge[];
    /** Похожие актуальные — только когда даты вакансии прошли (GS-277) */
    similar: SimilarOffer[];
    /** Цена годового членства волонтёра — для предложения, когда кончились бесплатные отклики */
    volunteerPrice: number;
    t: Translate;
    tOffer: Translate;
    tHost: Translate;
}) {
    const p = (key: string) => tOffer(`personalOffer.${key}`);
    const { condition, organization } = offer;
    // На /en и /es — перевод текстов (GS-227), оригинал — по кнопке
    const { description, original } = localizedDescription(offer);
    // Как galleryUrls старого фронта: large, иначе medium, иначе оригинал
    const gallery = (offer.galleryImages ?? [])
        .map((image) => mediaUrl(image, "large") === mediaUrl(image) ? mediaUrl(image, "medium") : mediaUrl(image, "large"))
        .filter((url): url is string => !!url);
    // Превью в стопке 130×130 — medium вместо large (на медленном интернете в разы меньше)
    const galleryThumbs = (offer.galleryImages ?? []).map((image) => mediaUrl(image, "medium")).filter((url): url is string => !!url);
    const galleryLabels = { close: t("Закрыть"), prev: t("slider.previous"), next: t("slider.next"), photo: t("gallery.photo") };
    const hrefs: OfferActionsHrefs = {
        signIn: routes.signIn(locale),
        profileRole: routes.profileRole(locale),
        messenger: routes.messenger(locale),
        edit: routes.offerEdit(locale, offer.id),
        membership: routes.membership(locale),
    };
    const labels = actionsLabels(tOffer, volunteerPrice);
    const volunteerHref = routes.volunteerPublicTemplate(locale);
    const categories = (description?.categories ?? []).map((category) => ({
        id: category.id,
        name: categoryName(category.name, t) ?? "",
        color: category.color,
    }));
    const statusLabel = ["active", "disabled", "draft"].includes(offer.status) ? p(offer.status) : "";

    return (
        <>
            <OfferHero
                title={description?.title ?? ""}
                image={mediaUrl(description?.image, "large")}
                status={offer.status}
                categories={categories}
                address={offer.where?.address}
                reviews={offer.reviewsCount}
                rating={Number(offer.averageRating) || 0}
                highlights={offerHighlights({ condition, whatToDo: offer.whatToDo, when: offer.when }, tOffer)}
                gallery={<OfferPhotoStack images={gallery} thumbs={galleryThumbs} labels={{ photos: p("Фотографии"), ...galleryLabels }} />}
                actions={<OfferActions offerId={offer.id} status={offer.status} variant="hero" hrefs={hrefs} labels={labels} />}
                labels={{ status: statusLabel, reviewsCount: tOffer("Кол-во отзывов:"), noReviews: tOffer("Пока нет отзывов") }}
            />
            <SectionSubmenu
                items={[
                    { id: "description", text: p("Описание") },
                    { id: "whatToDo", text: p("Что делать") },
                    { id: "terms", text: p("Условия") },
                    { id: "gallery", text: p("Фото") },
                    { id: "organization", text: p("Организация") },
                    { id: "participants", text: p("Участники") },
                    { id: "review", text: p("Отзывы") },
                ]}
            >
                <OfferActions offerId={offer.id} status={offer.status} variant="menu" hrefs={hrefs} labels={labels} />
            </SectionSubmenu>

            <div className="w-full max-w-[980px] pt-10">
                {offer.datesPassed && (
                    <OfferDatesPassed
                        similar={similar}
                        offerHref={(similarId) => routes.offer(locale, similarId)}
                        catalogHref={routes.offersMap(locale)}
                        labels={{
                            title: tOffer("Даты этой вакансии прошли"),
                            text: tOffer("Организатор ещё не указал новые даты — откликнуться можно, но ответа может не быть."),
                            similar: tOffer("Похожие проекты с актуальными датами"),
                            all: tOffer("Все актуальные вакансии"),
                            noAddress: t("Без адреса"),
                        }}
                    />
                )}
                {offer.organizationSleeping && (
                    <p role="note" className="mb-8 flex items-start gap-3 rounded-[10px] bg-notice-bg px-5 py-4 text-[15px] leading-[140%] text-ink-secondary">
                        <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-notice" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 7v5l3 2" /></svg>
                        <span>{tOffer("Организатор давно не заходил на Гудсёрфинг — ответа на заявку может не быть.")} <a href={routes.offersMap(locale)} className="text-primary underline">{tOffer("Посмотреть другие вакансии")}</a></span>
                    </p>
                )}
                {!offer.organizationSleeping && offer.relevanceStale && (
                    <p role="note" className="mb-8 flex items-start gap-3 rounded-[10px] bg-field px-5 py-4 text-[15px] leading-[140%] text-ink-secondary">
                        <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-caption" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4" /><path d="M12 17h.01" /><circle cx="12" cy="12" r="10" /></svg>
                        <span>{t("relevance.staleNote")}</span>
                    </p>
                )}
                {banner && (
                    <section
                        className="relative mb-10 flex items-center overflow-hidden rounded-[10px] bg-cover bg-center bg-no-repeat p-5 before:absolute before:inset-0 before:bg-black/40 down-md:min-h-[200px] down-md:rounded-2xl down-md:px-5 down-md:py-6"
                        style={banner.image ? { backgroundImage: `url(${JSON.stringify(banner.image)})` } : undefined}
                    >
                        <div className="relative z-[1] flex max-w-[560px] flex-col gap-4">
                            <p className="text-[20px] leading-[1.25] font-bold text-white down-md:text-[22px]">{banner.description}</p>
                            <a href={banner.url} className="w-fit rounded-[10px] border border-white px-[50px] py-3.5 text-[1rem] leading-[1.375rem] text-white transition-colors hover:bg-white hover:text-primary">
                                {t("Подробнее")}
                            </a>
                        </div>
                    </section>
                )}
                {offer.when && <OfferWhen when={offer.when} t={tOffer} />}
                {offer.howNeed && <OfferWhoNeeds need={offer.howNeed} t={tOffer} />}
                {offer.whatToDo && <OfferWhatToDo todo={offer.whatToDo} svgs={svgs} t={tOffer} tCommon={t} />}
                {description && (
                    <OfferDescription
                        description={description}
                        original={original}
                        t={tOffer}
                        translatedLabels={{ note: tOffer("Переведено автоматически"), showOriginal: tOffer("Показать оригинал"), showTranslation: tOffer("Показать перевод") }}
                    />
                )}
                {condition && (
                    <>
                        <OfferTerms condition={condition} svgs={svgs} t={tOffer} />
                        <OfferExtraConditions text={condition.additionalConditions} t={tOffer} />
                    </>
                )}
                {offer.finishingTouche && <OfferFinishing finishing={offer.finishingTouche} t={tOffer} />}
                {condition && <OfferPayment condition={condition} t={tOffer} />}
                {offer.howNeed && <OfferLanguages languages={offer.howNeed.languages ?? []} t={tOffer} />}
                {offer.where && (
                    <div className="mt-10 flex flex-col gap-5">
                        <SectionTitle>{p("Местоположение")}</SectionTitle>
                        <span>{offer.where.address}</span>
                        <OfferAddressMap latitude={Number(offer.where.latitude)} longitude={Number(offer.where.longitude)} locale={locale} />
                    </div>
                )}
                {gallery.length > 0 && (
                    <div id="gallery" className="mt-10">
                        <SectionTitle>{p("Фотографии")}</SectionTitle>
                        <GalleryCarousel images={gallery} className="mt-[30px]" labels={{ open: t("gallery.open"), ...galleryLabels }} />
                    </div>
                )}
                <OfferOrganization
                    name={organization.name}
                    type={organizationType(organization.type, tHost)}
                    response={responseStatsText(organization.responseStats, tOffer)}
                    image={mediaUrl(organization.image, "small")}
                    href={routes.organization(locale, organization.id)}
                    labels={{ title: p("Организация"), more: p("Подробнее") }}
                    badges={badges}
                    badgesHref={routes.achievements(locale)}
                    slowReply={organization.responseStats?.slow ? { label: tHost("slowReply.label"), hint: tHost("slowReply.hint") } : null}
                    verified={organization.isVerified ? {
                        badge: t("membershipBadge.Партнёр Гудсёрфинга"),
                        hint: tHost("verifiedHost.hint"),
                        howTo: tHost("verifiedHost.howTo"),
                        membershipHref: routes.membership(locale),
                    } : null}
                />
                <OfferParticipants
                    offerId={offer.id}
                    initial={participants}
                    volunteerHref={volunteerHref}
                    labels={{
                        title: p("Участники"),
                        description: tOffer("В нашем сообществе вы можете поговорить с волонтерами, которые уже сотрудничали с этим хостом, и получить прямые ответы на свои вопросы."),
                        empty: p("На данный момент у данной вакансии нет участников"),
                        error: p("Произошла ошибка загрузки участников"),
                        showNext: p("Посмотреть следующие"),
                        anonymous: t("Анонимный пользователь"),
                    }}
                />
                <OfferReviews
                    offerId={offer.id}
                    initial={reviews}
                    volunteerHref={volunteerHref}
                    labels={{
                        title: p("Отзывы"),
                        empty: tOffer("На данный момент отзывов нет"),
                        loadError: tOffer("Произошла ошибка загрузки отзывов"),
                        sendError: tOffer("Не удалось отправить отзыв. Попробуйте позже."),
                        deleteError: tOffer("Не удалось удалить отзыв. Попробуйте позже."),
                        deleteConfirm: tOffer("Удалить отзыв? Это действие нельзя отменить."),
                        delete: t("Удалить отзыв"),
                        showNext: p("Посмотреть следующие"),
                        anonymous: t("Анонимный пользователь"),
                        write: p("Написать отзыв"),
                        placeholder: p("Ваш отзыв"),
                        rating: p("Отзывы"),
                        addPhoto: t("Добавить фото"),
                        removePhoto: t("Удалить"),
                        tooMany: t("Нельзя загрузить больше 10 файлов"),
                        gallery: galleryLabels,
                    }}
                />
                {description && (
                    <OfferShare url={`${siteUrl()}${routes.offer(locale, offer.id)}`} title={description.title} label={p("Поделиться вакансией")} />
                )}
            </div>
            {/* Кнопка внизу экрана на телефоне; отступ — чтобы она не закрывала конец страницы */}
            <OfferActions offerId={offer.id} status={offer.status} variant="sticky" hrefs={hrefs} labels={labels} />
            <div aria-hidden className="hidden h-20 down-md:block" />
        </>
    );
}
