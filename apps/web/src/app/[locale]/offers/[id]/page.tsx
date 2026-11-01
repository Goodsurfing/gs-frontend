import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { OfferActions, type OfferActionsHrefs, type OfferActionsLabels } from "@/components/offer/OfferActions";
import { OfferAddressMap } from "@/components/offer/OfferAddressMap";
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
import { isLocale, type Locale } from "@/i18n/config";
import { getTranslator, type Translate } from "@/i18n/dictionary";
import { categoryName } from "@/lib/categories";
import { mediaUrl } from "@/lib/media";
import { getOffer, getOfferBanner, getOfferParticipants, getOfferReviews, inlineSvg, type OfferDetail } from "@/lib/offer";
import { organizationType, PARTICIPATE_STATES, responseStatsText } from "@/lib/offerText";
import { routes } from "@/lib/routes";
import { pageMetadata, siteUrl } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; id: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    if (!isLocale(locale)) return {};
    const [result, tMain] = await Promise.all([getOffer(locale, id), getTranslator(locale, "main")]);
    const path = routes.offer(locale, id);
    if (result.kind !== "ok") {
        return pageMetadata({ locale, path, title: tMain("seo.title"), description: tMain("seo.description"), noindex: true });
    }
    const { description } = result.offer;
    return pageMetadata({
        locale,
        path,
        title: description?.title || tMain("seo.title"),
        description: description?.shortDescription || description?.description || tMain("seo.description"),
        // Краулерам нужен оригинал обложки
        image: mediaUrl(description?.image),
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

function actionsLabels(t: Translate): OfferActionsLabels {
    return {
        participate: t("personalOffer.Участвовать"),
        closed: t("personalOffer.vacancyClosed"),
        becomeVolunteer: t("personalOffer.Чтобы участвовать, станьте гудсёрфером"),
        states: Object.fromEntries(PARTICIPATE_STATES.map((state) => [state, t(`personalOffer.${state}`)])),
        edit: t("personalOffer.Редактировать"),
        noFreeApplications: t("personalOffer.У вас закончились бесплатные отклики."),
        getMembership: t("personalOffer.Оформите членство, чтобы отправить заявку"),
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

    const [participants, reviews, banner, svgs] = await Promise.all([
        getOfferParticipants(locale, id),
        getOfferReviews(locale, id),
        getOfferBanner(locale),
        referenceIcons(offer),
    ]);
    return (
        <PublicShell locale={locale}>
            <OfferViewerProvider offerId={offer.id}>
                <div className="mx-auto flex min-h-[500px] w-full max-w-[1920px] flex-col items-center justify-center px-[50px] pt-[100px] pb-[50px] down-lg:p-5">
                    <OfferBody locale={locale} offer={offer} participants={participants} reviews={reviews} banner={banner} svgs={svgs} t={t} tOffer={tOffer} tHost={tHost} />
                </div>
            </OfferViewerProvider>
        </PublicShell>
    );
}

function OfferBody({ locale, offer, participants, reviews, banner, svgs, t, tOffer, tHost }: {
    locale: Locale;
    offer: OfferDetail;
    participants: Awaited<ReturnType<typeof getOfferParticipants>>;
    reviews: Awaited<ReturnType<typeof getOfferReviews>>;
    banner: Awaited<ReturnType<typeof getOfferBanner>>;
    svgs: SvgMap;
    t: Translate;
    tOffer: Translate;
    tHost: Translate;
}) {
    const p = (key: string) => tOffer(`personalOffer.${key}`);
    const { description, condition, organization } = offer;
    // Как galleryUrls старого фронта: large, иначе medium, иначе оригинал
    const gallery = (offer.galleryImages ?? [])
        .map((image) => mediaUrl(image, "large") === mediaUrl(image) ? mediaUrl(image, "medium") : mediaUrl(image, "large"))
        .filter((url): url is string => !!url);
    const galleryLabels = { close: t("Закрыть"), prev: t("slider.previous"), next: t("slider.next"), photo: t("gallery.photo") };
    const hrefs: OfferActionsHrefs = {
        signIn: routes.signIn(locale),
        profileRole: routes.profileRole(locale),
        messenger: routes.messenger(locale),
        edit: routes.offerEdit(locale, offer.id),
        membership: routes.membership(locale),
    };
    const labels = actionsLabels(tOffer);
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
                gallery={<OfferPhotoStack images={gallery} labels={{ photos: p("Фотографии"), ...galleryLabels }} />}
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
                {description && <OfferDescription description={description} t={tOffer} />}
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
                        // Тексты ниже в старом фронте не переводились — оставлены как были
                        empty: "На данный момент отзывов нет",
                        loadError: "Произошла ошибка загрузки отзывов",
                        sendError: "Не удалось отправить отзыв. Попробуйте позже.",
                        deleteError: "Не удалось удалить отзыв. Попробуйте позже.",
                        deleteConfirm: "Удалить отзыв? Это действие нельзя отменить.",
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
        </>
    );
}
