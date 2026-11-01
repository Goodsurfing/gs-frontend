import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FundraiseActions } from "@/components/donation/FundraiseActions";
import { GalleryCarousel } from "@/components/gallery/GalleryCarousel";
import { PublicShell } from "@/components/layout/PublicShell";
import { OfferAddressMap } from "@/components/offer/OfferAddressMap";
import { OfferHero } from "@/components/offer/OfferHero";
import { OfferOrganization } from "@/components/offer/OfferOrganization";
import { OfferPhotoStack } from "@/components/offer/OfferPhotoStack";
import { OfferShare } from "@/components/offer/OfferShare";
import { InfoCard, InfoCardItem, SectionTitle } from "@/components/offer/parts";
import { SectionSubmenu } from "@/components/ui/SectionSubmenu";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { categoryName } from "@/lib/categories";
import { type FundraiseDetail, getDonors, getFundraise } from "@/lib/fundraise";
import { mediaUrl } from "@/lib/media";
import { routes } from "@/lib/routes";
import { pageMetadata, seoDescription, siteUrl } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    if (!isLocale(locale)) return {};
    const [result, t] = await Promise.all([getFundraise(locale, id), getTranslator(locale, "donation")]);
    const path = routes.fundraise(locale, id);
    if (result.kind !== "ok") return pageMetadata({ locale, path, title: t("personalSeo.title"), description: t("personalSeo.description"), noindex: true });
    const { fundraise } = result;
    return {
        ...pageMetadata({
            locale,
            path,
            title: fundraise.name || t("personalSeo.title"),
            description: (fundraise.description && seoDescription(fundraise.description)) || t("personalSeo.description"),
            // Краулерам нужен оригинал обложки
            image: mediaUrl(fundraise.image) ?? mediaUrl(fundraise.galleryImages[0]),
            noindex: fundraise.status === "draft",
        }),
        keywords: t("personalSeo.keywords"),
    };
}

/** Сообщение вместо сбора (ошибка, черновик) — как в старом фронте */
function Message({ text }: { text: string }) {
    return (
        <div className="mx-auto flex min-h-[500px] w-full max-w-[1920px] flex-col items-center justify-center px-[50px] pt-[92px] pb-[50px] down-lg:p-5">
            <p className="flex h-[80vh] justify-center text-[14px] leading-[1.2] font-medium">{text}</p>
        </div>
    );
}

const money = new Intl.NumberFormat("ru-RU");

/** «Собрано»: сумма из цели и процент, или только сумма, если цели нет */
function progressText(fundraise: FundraiseDetail) {
    if (fundraise.amount && fundraise.amount > 0) {
        return `${money.format(fundraise.collectedAmount)} ₽ / ${money.format(fundraise.amount)} ₽ (${fundraise.percentAmountCollect ?? 0}%)`;
    }
    return `${money.format(fundraise.collectedAmount)} ₽`;
}

function Stat({ icon, text, tone }: { icon: string; text: string; tone: string }) {
    return (
        <div className="flex items-start gap-1.5 text-[14px] leading-[120%] font-medium">
            <span className="block">
                {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                <img src={`/web/icons/donation/${icon}.svg`} alt="" className="inline h-[13px] w-[13px]" />
            </span>
            <span className={tone}>{text}</span>
        </div>
    );
}

/** Страница сбора пожертвований (DonationPersonalPage старого фронта, GS-219) */
export default async function FundraisePage({ params }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const [result, t, tDonation, tOffer] = await Promise.all([
        getFundraise(locale, id),
        getTranslator(locale),
        getTranslator(locale, "donation"),
        getTranslator(locale, "offer"),
    ]);
    const d = (key: string) => tDonation(`donationPersonal.${key}`);

    if (result.kind !== "ok") {
        return <PublicShell locale={locale} headerVariant="static"><Message text={tDonation("Произошла ошибка")} /></PublicShell>;
    }
    const { fundraise } = result;
    if (fundraise.status === "draft") {
        return <PublicShell locale={locale} headerVariant="static"><Message text={tDonation("Сбор не опубликован")} /></PublicShell>;
    }
    const donors = await getDonors(locale, id);

    const gallery = fundraise.galleryImages.map((image) => mediaUrl(image, "large")).filter((url): url is string => !!url);
    const galleryLabels = { close: t("Закрыть"), prev: t("slider.previous"), next: t("slider.next"), photo: t("gallery.photo") };
    const hrefs = {
        signIn: routes.signIn(locale),
        profileRole: routes.profileRole(locale),
        pay: routes.donationPay(locale, id),
        edit: routes.fundraiseEdit(locale, id),
    };
    const actionLabels = { support: d("Поддержать"), becomeVolunteer: d("Чтобы участвовать, станьте гудсёрфером"), edit: d("Редактировать") };
    const hasProgress = fundraise.collectedAmount > 0 || (fundraise.amount ?? 0) > 0;

    return (
        <PublicShell locale={locale} headerVariant="static">
            <div className="mx-auto flex min-h-[500px] w-full max-w-[1920px] flex-col items-center justify-center px-[50px] pt-[92px] pb-[50px] down-lg:p-5">
                <OfferHero
                    title={fundraise.name}
                    image={mediaUrl(fundraise.image, "large")}
                    status={fundraise.status}
                    categories={fundraise.categories.map((category) => ({ id: category.id, name: categoryName(category.name, t) ?? "", color: category.color }))}
                    address={fundraise.address}
                    stats={(tone) => (
                        <>
                            <p className={tone}>{d("Людей поддержало")}: {fundraise.peopleSupportCount}</p>
                            {fundraise.isSuccess ? (
                                <Stat icon="check" tone={tone} text={`${d("Проект собрал")} ${fundraise.percentAmountCollect} %`} />
                            ) : (
                                <>
                                    <Stat icon="flag" tone={tone} text={`${d("Средств собрано")} ${fundraise.percentAmountCollect} %`} />
                                    {fundraise.daysLeft !== null && <Stat icon="calendar" tone={tone} text={`${d("Дней осталось")} ${fundraise.daysLeft}`} />}
                                </>
                            )}
                        </>
                    )}
                    gallery={<OfferPhotoStack images={gallery} labels={{ photos: tOffer("personalOffer.Фотографии"), ...galleryLabels }} />}
                    actions={<FundraiseActions fundraiseId={id} variant="hero" hrefs={hrefs} labels={actionLabels} />}
                    labels={{ status: ["active", "close", "draft"].includes(fundraise.status) ? d(fundraise.status) : "", reviewsCount: "", noReviews: "" }}
                />
                <SectionSubmenu
                    items={[
                        { id: "description", text: d("Описание") },
                        { id: "address", text: d("Местоположение") },
                        { id: "organization", text: d("Организация") },
                        { id: "gallery", text: d("Фотографии") },
                        { id: "participants", text: d("Участники") },
                    ]}
                >
                    <FundraiseActions fundraiseId={id} variant="menu" hrefs={hrefs} labels={actionLabels} />
                </SectionSubmenu>
                <div className="w-full max-w-[980px] pt-10">
                    <div id="description">
                        <InfoCard className="flex-nowrap">
                            <InfoCardItem title={d("Дата старта")} className="w-full">
                                {fundraise.startDate || d("Не имеет даты старта")}
                            </InfoCardItem>
                            {fundraise.daysLeft !== null && !fundraise.isSuccess && (
                                <InfoCardItem title={d("Дней осталось")} text={fundraise.daysLeft} className="w-full" />
                            )}
                            {hasProgress && (
                                <InfoCardItem title={fundraise.isSuccess ? d("Проект собрал") : d("Средств собрано")} text={progressText(fundraise)} className="w-full">
                                    <div
                                        role="progressbar"
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={fundraise.percentAmountCollect ?? 0}
                                        className={`h-[5px] overflow-hidden rounded-[2.5px] ${fundraise.isSuccess ? "bg-[#21212126]" : "bg-[#3CABF740]"}`}
                                    >
                                        <div
                                            className={`h-full rounded-[2.5px] ${fundraise.isSuccess ? "bg-caption" : "bg-primary"}`}
                                            style={{ width: `${Math.min(100, fundraise.percentAmountCollect ?? 0)}%` }}
                                        />
                                    </div>
                                </InfoCardItem>
                            )}
                        </InfoCard>
                    </div>
                    <div className="mt-10 flex w-full flex-col gap-10">
                        <div className="flex flex-col gap-5">
                            <SectionTitle>{d("Описание")}</SectionTitle>
                            <p className="text-[14px] font-medium [overflow-wrap:break-word] whitespace-pre-line">{fundraise.description || d("Описание не было заполнено")}</p>
                        </div>
                    </div>
                    {fundraise.latitude !== null && fundraise.longitude !== null ? (
                        <div id="address" className="mt-10 flex flex-col gap-5">
                            <SectionTitle>{d("Местоположение")}</SectionTitle>
                            <span>{fundraise.address}</span>
                            <OfferAddressMap latitude={Number(fundraise.latitude)} longitude={Number(fundraise.longitude)} locale={locale} />
                        </div>
                    ) : (
                        <div className="mt-10 flex flex-col gap-5">
                            <SectionTitle>{d("Местоположение")}</SectionTitle>
                            <span>{d("Местоположение не было указано")}</span>
                        </div>
                    )}
                    <OfferOrganization
                        name={fundraise.organization.name}
                        type={fundraise.organization.description ?? ""}
                        // Как в старом фронте: в аватаре — обложка сбора, а не логотип организации
                        image={mediaUrl(fundraise.image, "small")}
                        href={routes.organization(locale, fundraise.organization.id)}
                        labels={{ title: d("Организация"), more: d("Подробнее") }}
                    />
                    <div id="gallery" className="mt-10 flex flex-col gap-5">
                        <SectionTitle>{d("Фотографии")}</SectionTitle>
                        {gallery.length > 0
                            ? <GalleryCarousel images={gallery} className="mt-[30px]" labels={{ open: t("gallery.open"), ...galleryLabels }} />
                            : <p className="text-[14px] font-medium">{d("Фотографии не были добавлены")}</p>}
                    </div>
                    <div id="participants" className="mt-10">
                        <h3 className="mb-4 text-[20px] font-bold text-[#212b36]">{d("Участники сбора")}</h3>
                        {!donors || donors.count === 0 ? (
                            <p className="py-4 text-[14px] text-[#919eab]">{d("Пока нет пожертвований")}</p>
                        ) : (
                            <>
                                <div className="mb-4 flex gap-6">
                                    <span className="text-[14px] text-[#637381]">{d("Всего")}: <span className="font-bold text-[#212b36]">{donors.count}</span></span>
                                    <span className="text-[14px] text-[#637381]">{d("Собрано")}: <span className="font-bold text-[#212b36]">{money.format(donors.collected)} ₽</span></span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {donors.items.map((donor) => (
                                        <div key={donor.id} className="flex items-center justify-between rounded-[10px] bg-[#f9fafb] px-4 py-3">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[14px] font-semibold text-[#212b36]">{donor.anonymous ? d("Аноним") : donor.name || d("Аноним")}</span>
                                                <span className="text-[12px] text-[#919eab]">{donor.date}</span>
                                            </div>
                                            <span className="text-[16px] font-bold whitespace-nowrap text-[#1b6b93]">{money.format(donor.amount)} ₽</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <OfferShare url={`${siteUrl()}${routes.fundraise(locale, id)}`} title={fundraise.name} label={d("Поделиться сбором")} />
                </div>
            </div>
        </PublicShell>
    );
}
