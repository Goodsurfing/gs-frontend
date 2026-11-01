import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GalleryCarousel } from "@/components/gallery/GalleryCarousel";
import { PublicShell } from "@/components/layout/PublicShell";
import { MembershipBadges } from "@/components/membership/MembershipBadges";
import { SectionTitle } from "@/components/offer/parts";
import { OrganizationOffers } from "@/components/organization/OrganizationOffers";
import { OrganizationReviews } from "@/components/organization/OrganizationReviews";
import { Avatar } from "@/components/ui/Avatar";
import { SectionSubmenu } from "@/components/ui/SectionSubmenu";
import { WriteOrEditActions } from "@/components/ui/WriteOrEditActions";
import { VideoCarousel } from "@/components/video/VideoCarousel";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { categoryLabels } from "@/lib/categories";
import { mediaUrl } from "@/lib/media";
import { organizationType } from "@/lib/offerText";
import { getOrganization, getOrganizationOffers, getOrganizationReviews } from "@/lib/organization";
import { routes } from "@/lib/routes";
import { pageMetadata, seoDescription } from "@/lib/seo";
import { socialLink } from "@/lib/socialLink";

type Props = { params: Promise<{ locale: string; id: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    if (!isLocale(locale)) return {};
    const [result, tSeo] = await Promise.all([getOrganization(locale, id), getTranslator(locale, "seo")]);
    const path = routes.organization(locale, id);
    if (result.kind !== "ok") {
        return pageMetadata({ locale, path, title: tSeo("host.title"), description: tSeo("host.description"), noindex: true });
    }
    const { organization } = result;
    const description = organization.shortDescription || organization.description;
    return pageMetadata({
        locale,
        path,
        title: organization.name ? `${organization.name} — GoodSurfing` : tSeo("host.title"),
        description: description ? seoDescription(description) : tSeo("host.description"),
        image: mediaUrl(organization.avatar),
        type: "profile",
    });
}

/** Публичная страница организации (HostPersonalPage старого фронта, GS-219) */
export default async function OrganizationPage({ params }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const [result, t, tHost, tProfile, tOffer] = await Promise.all([
        getOrganization(locale, id),
        getTranslator(locale),
        getTranslator(locale, "host"),
        getTranslator(locale, "profile"),
        getTranslator(locale, "offer"),
    ]);
    const h = (key: string) => tHost(`personalHost.${key}`);

    if (result.kind !== "ok") {
        return (
            <PublicShell locale={locale} headerVariant="static">
                <div className="mx-auto min-h-[80vh] w-full max-w-[1920px] px-[50px] pt-[92px] pb-[50px] down-lg:p-5">
                    <p className="text-[14px] leading-[120%] font-medium down-lg:text-center">{h("Произошла ошибка")}</p>
                </div>
            </PublicShell>
        );
    }
    const organization = result.organization;
    const [offers, reviews] = await Promise.all([
        getOrganizationOffers(locale, id, t),
        getOrganizationReviews(locale, id),
    ]);
    const owner = organization.owner as { id?: string; isMember?: boolean } | undefined;
    const gallery = (organization.galleryImages ?? [])
        .map((image) => mediaUrl(image, "large"))
        .filter((url): url is string => !!url);
    const videos = organization.videoGallery ?? [];
    const vk = socialLink(organization.vk, "vk");
    const telegram = socialLink(organization.telegram, "telegram");
    const actions = (
        <WriteOrEditActions
            ownerId={owner?.id}
            hrefs={{ edit: routes.hostInfo(locale), messenger: routes.messenger(locale) }}
            labels={{ edit: h("Редактировать профиль"), write: h("Написать") }}
        />
    );
    const sliderLabels = { prev: t("slider.previous"), next: t("slider.next") };

    return (
        <PublicShell locale={locale} headerVariant="static">
            <div className="mx-auto min-h-[80vh] w-full max-w-[1920px] px-[50px] pt-[92px] pb-[50px] down-lg:p-5">
                <div className="box-border flex min-h-[230px] w-full flex-wrap gap-[60px] rounded-[10px] bg-field px-[60px] py-10 down-sm:p-5">
                    <Avatar src={mediaUrl(organization.avatar, "medium")} name={organization.name} size={150} />
                    <div className="w-full max-w-[510px]">
                        <span className="text-[14px] font-medium text-ink-secondary">
                            {h("Организация/")}
                            {organizationType(organization.type ?? "", tHost)}
                        </span>
                        <div className="flex items-center">
                            <h1 className="text-[26px] font-normal text-ink-secondary">{organization.name}</h1>
                            {owner?.isMember && (
                                <MembershipBadges
                                    badge={t("membershipBadge.Партнёр Гудсёрфинга")}
                                    membershipHref={routes.membership(locale)}
                                    labels={{
                                        verified: tProfile("personal.Верифицированный пользователь. Хочешь, чтобы тебе тоже больше доверяли? Оформи членство!"),
                                        howTo: tProfile("personal.Как это сделать?"),
                                    }}
                                />
                            )}
                        </div>
                        <span>{organization.address}</span>
                        <div className="mt-5 grid max-w-[250px] grid-cols-2 gap-2 down-sm:grid-cols-1">
                            {vk && (
                                <a href={vk} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                                    {/* Строчная иконка в блоке, как в старом фронте: строка 21 px */}
                                    <span className="block">
                                        {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                        <img src="/web/icons/organization/vk.svg" alt="" className="inline" />
                                    </span>
                                    <span className="text-[14px] font-bold text-ink">{tHost("Вконтакте")}</span>
                                </a>
                            )}
                            {telegram && (
                                <a href={telegram} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                                    {/* Строчная иконка в блоке, как в старом фронте: строка 21 px */}
                                    <span className="block">
                                        {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                        <img src="/web/icons/organization/telegram.svg" alt="" className="inline" />
                                    </span>
                                    <span className="text-[14px] font-bold text-ink">Telegram</span>
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="ml-auto flex w-full max-w-[280px] flex-col down-sm:ml-0 [&>a]:mt-auto">{actions}</div>
                </div>

                <SectionSubmenu
                    className="z-[8]"
                    items={[
                        { id: "1", text: h("Об организации") },
                        { id: "2", text: h("Вакансии") },
                        { id: "3", text: h("Фото") },
                        { id: "4", text: h("Видео") },
                        { id: "6", text: h("Отзывы") },
                    ]}
                >
                    {actions}
                </SectionSubmenu>

                <div className="mx-auto flex max-w-[980px] flex-col items-center justify-center">
                    <div id="1" className="mt-[60px] w-full">
                        <SectionTitle>{h("Об организации")}</SectionTitle>
                        <p className="mt-5 whitespace-pre-line break-words">{organization.description || h("Организатор не указал данную информацию")}</p>
                    </div>
                    <div id="2" className="mt-[60px] w-full">
                        <SectionTitle>{h("Вакансии")}</SectionTitle>
                        <OrganizationOffers
                            organizationId={id}
                            initial={offers}
                            offerHref={routes.offer(locale, "{id}")}
                            categories={categoryLabels(t)}
                            labels={{
                                empty: h("У организации пока нет вакансий"),
                                card: {
                                    more: t("Подробнее"),
                                    notOnMap: t("нет на карте"),
                                    reviews: t("Отзывов"),
                                    went: t("Отправились"),
                                    noTitle: t("Без заголовка"),
                                    noDescription: t("Без описания"),
                                },
                            }}
                        />
                    </div>
                    <div id="3" className="mt-[60px] w-full">
                        <SectionTitle>{h("Фото")}</SectionTitle>
                        {gallery.length > 0 ? (
                            <GalleryCarousel
                                images={gallery}
                                className="mt-[30px]"
                                labels={{ open: t("gallery.open"), photo: t("gallery.photo"), close: t("Закрыть"), ...sliderLabels }}
                            />
                        ) : <p className="mt-[30px]">{h("Галерея не заполнена")}</p>}
                    </div>
                    <div id="4" className="mt-[60px] w-full">
                        <SectionTitle>{h("Видео")}</SectionTitle>
                        {videos.length > 0 ? (
                            <VideoCarousel
                                videos={videos}
                                className="mt-[30px]"
                                labels={{ ...sliderLabels, video: h("Видео"), unsupported: t("Неподдерживаемая ссылка на видео") }}
                            />
                        ) : <p className="mt-[30px]">{h("Видеогалерея не заполнена")}</p>}
                    </div>
                    {reviews && reviews.total > 0 && (
                        <div id="6" className="mt-[60px] w-full">
                            <SectionTitle>{h("Отзывы")}</SectionTitle>
                            <OrganizationReviews
                                organizationId={id}
                                initial={reviews}
                                labels={{
                                    error: h("Произошла ошибка загрузки отзывов"),
                                    showNext: tOffer("personalOffer.Посмотреть следующие"),
                                    anonymous: t("Анонимный пользователь"),
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </PublicShell>
    );
}
