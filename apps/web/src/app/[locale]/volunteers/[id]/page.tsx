import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GalleryCarousel } from "@/components/gallery/GalleryCarousel";
import { PublicShell } from "@/components/layout/PublicShell";
import { InternationalBadge, MembershipBadges } from "@/components/membership/MembershipBadges";
import { OfferOrganization } from "@/components/offer/OfferOrganization";
import { IconGrid, IconText, MaskIcon, RemoteSvg, SectionTitle } from "@/components/offer/parts";
import { Avatar } from "@/components/ui/Avatar";
import { SectionSubmenu } from "@/components/ui/SectionSubmenu";
import { WriteOrEditActions } from "@/components/ui/WriteOrEditActions";
import { VideoCarousel } from "@/components/video/VideoCarousel";
import { CertificatesCarousel } from "@/components/volunteer/CertificatesCarousel";
import { VolunteerAchievements } from "@/components/volunteer/VolunteerAchievements";
import { VolunteerOffers } from "@/components/volunteer/VolunteerOffers";
import { VolunteerReviews } from "@/components/volunteer/VolunteerReviews";
import { failOnApiError } from "@/lib/apiUnavailable";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { categoryLabels } from "@/lib/categories";
import { mediaUrl } from "@/lib/media";
import { inlineSvg } from "@/lib/offer";
import { languageNames, languagesText, skillName } from "@/lib/offerText";
import { getOrganization } from "@/lib/organization";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { socialLink } from "@/lib/socialLink";
import { getParticipatedOffers, getVolunteer } from "@/lib/volunteer";

type Props = { params: Promise<{ locale: string; id: string }> };

// У навыков и достижений API отдаёт картинку, но в схеме её нет
const withImage = (item: object) => item as { image?: { contentUrl?: string; thumbnails?: unknown } | null };

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
    const tSeo = await getTranslator(locale, "seo");
    // Профиль человека: не индексируем и имя в заголовок не выносим (как в старом фронте)
    return pageMetadata({
        locale,
        path: routes.volunteerPublic(locale, id),
        title: tSeo("volunteer.title"),
        description: tSeo("volunteer.description"),
        type: "profile",
        noindex: true,
    });
}

/** Публичная страница пользователя (VolunteerPersonalPage старого фронта, GS-219) */
export default async function VolunteerPage({ params }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const [result, t, tProfile, tOffer] = await Promise.all([
        getVolunteer(locale, id),
        getTranslator(locale),
        getTranslator(locale, "profile"),
        getTranslator(locale, "offer"),
    ]);
    const p = (key: string) => tProfile(`personal.${key}`);
    const message = (text: string) => (
        <PublicShell locale={locale} headerVariant="static">
            <div className="mx-auto flex min-h-[80vh] w-full max-w-[1920px] flex-col px-[50px] pt-[92px] down-lg:px-5">
                <p className="flex h-[80vh] items-center justify-center text-[14px] leading-[120%] font-medium down-lg:text-center">{text}</p>
            </div>
        </PublicShell>
    );
    failOnApiError(result, `волонтёр ${id}`);
    if (result.kind === "notFound") return message(p("Произошла ошибка или пользователь не зарегистрирован как волонтёр"));
    const profile = result.profile;
    // Заблокированный профиль: старый фронт показывал его только самому владельцу; страница общая — не показываем
    if (profile.isActive === false) return message(p("Профиль недоступен"));

    const volunteer = profile.volunteer as typeof profile.volunteer | null;
    const name = `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || t("Анонимный пользователь");
    const [organization, offers, svgs] = await Promise.all([
        profile.hostId ? getOrganization(locale, profile.hostId) : null,
        volunteer ? getParticipatedOffers(locale, volunteer.participatedVacancyIds ?? [], t) : [],
        Promise.all((volunteer?.skills ?? []).map((skill) => inlineSvg(withImage(skill).image?.contentUrl))),
    ]);
    const roles = [volunteer && p("Волонтёр"), profile.hostId && p("Организатор")].filter(Boolean).join(", ");
    const languages = volunteer?.languages ?? [];
    const gallery = ((profile.galleryImages ?? []) as unknown as { contentUrl?: string; thumbnails?: unknown }[])
        .map((image) => mediaUrl(image, "large"))
        .filter((url): url is string => !!url);
    const videos = profile.videoGallery ?? [];
    // В схеме сертификаты — строки, на деле API отдаёт файлы-объекты; берём оба вида
    const certificates = ((volunteer?.certificates ?? []) as unknown as (string | { contentUrl?: string })[])
        .map((file) => mediaUrl(typeof file === "string" ? { contentUrl: file } : file))
        .filter((url): url is string => !!url);
    const socials = [
        { href: socialLink(profile.vk, "vk"), icon: "vk", label: tProfile("Вконтакте") },
        { href: socialLink(profile.telegram, "telegram"), icon: "telegram", label: "Telegram" },
        // Facebook и Instagram не показываем: Meta признана в РФ экстремистской (решение 10.11.2026)
    ].filter((item) => item.href);
    const sliderLabels = { prev: t("slider.previous"), next: t("slider.next") };
    const actions = (className: string) => (
        <WriteOrEditActions
            ownerId={id}
            hrefs={{ edit: routes.volunteerDashboard(locale), messenger: routes.messenger(locale) }}
            labels={{ edit: p("Редактировать"), write: p("Написать") }}
            className={className}
        />
    );
    const achievements = (volunteer?.achievements ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        image: mediaUrl(withImage(item).image, "small"),
    }));

    const place = [profile.country, profile.city].filter(Boolean).join(", ");
    const skills = volunteer?.skills ?? [];
    const additionalSkills = volunteer?.additionalSkills ?? [];
    const participated = volunteer?.participatedVacancyIds ?? [];
    // Профиль совсем пустой — одна строка вместо пустой страницы (отзывы, если есть, всё равно ниже)
    const blank = !profile.aboutMe && !volunteer?.externalInfo && !(organization?.kind === "ok" && profile.hostId) && skills.length === 0 && additionalSkills.length === 0
        && languages.length === 0 && participated.length === 0 && gallery.length === 0 && videos.length === 0 && certificates.length === 0;

    return (
        <PublicShell locale={locale} headerVariant="static">
            <div className="mx-auto flex min-h-[80vh] w-full max-w-[1920px] flex-col px-[50px] pt-[92px] down-lg:px-5">
                <div className="flex w-full flex-wrap justify-between gap-[60px] rounded-[10px] bg-field px-[60px] py-10 down-lg:p-5 down-sm:justify-center">
                    <div className="flex gap-[60px] down-lg:flex-col">
                        <Avatar src={mediaUrl(profile.image, "medium")} name={name} size={150} />
                        <div className="flex flex-col gap-4">
                            <div>
                                <span>{roles}{" "}</span>
                                {profile.isMember && (
                                    <MembershipBadges
                                        badge={t("membershipBadge.Член сообщества")}
                                        membershipHref={routes.membership(locale)}
                                        labels={{
                                            verified: p("Верифицированный пользователь. Хочешь, чтобы тебе тоже больше доверяли? Оформи членство!"),
                                            howTo: p("Как это сделать?"),
                                        }}
                                        only="verified"
                                    />
                                )}
                            </div>
                            <h1 className="text-[26px] font-normal">
                                {name}
                                {profile.isMember && (
                                    <MembershipBadges badge={t("membershipBadge.Член сообщества")} membershipHref={routes.membership(locale)} labels={{ verified: "", howTo: "" }} only="badge" />
                                )}
                                {profile.isInternationalMember && <InternationalBadge label={t("membershipBadge.Международный клуб")} />}
                            </h1>
                            <div className="flex flex-col gap-2 text-[14px] font-medium text-caption">
                                {place && (
                                    <span>
                                        {p("Город")}:{" "}
                                        <span className="text-ink-secondary"><span>{place}</span></span>
                                    </span>
                                )}
                                {languages.length > 0 && (
                                    <span>
                                        {p("Языки")}:{" "}
                                        <span className="text-ink-secondary"><span>{languageNames(languages, tOffer)}</span></span>
                                    </span>
                                )}
                                <div className="mt-5 grid max-w-[250px] grid-cols-2 gap-2 down-sm:grid-cols-1">
                                    {socials.map((social) => (
                                        <a key={social.icon} href={social.href} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                                            <span className="block">
                                                {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                                <img src={`/web/icons/organization/${social.icon}.svg`} alt="" className="inline" />
                                            </span>
                                            <span className="text-[14px] font-bold text-ink">{social.label}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[30px]">
                        {achievements.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-4">
                                    <VolunteerAchievements achievements={achievements} labels={{ more: p("Ещё"), title: p("Все достижения пользователя"), close: t("Закрыть") }} />
                                </div>
                                <a href={routes.achievements(locale)} className="text-[13px] text-primary">{p("allAchievements")}</a>
                            </div>
                        )}
                        <div className="mt-auto">{actions("")}</div>
                    </div>
                </div>

                <SectionSubmenu
                    // Пустые разделы не показываются — и в меню их нет (решение владельца 05.11.2026);
                    // отзывы грузятся в браузере, их пункт меню прячет само меню, если раздела нет на странице
                    items={[
                        profile.aboutMe ? { id: "1", text: p("О себе") } : null,
                        skills.length > 0 || additionalSkills.length > 0 ? { id: "skills", text: p("Умения") } : null,
                        participated.length > 0 ? { id: "2", text: p("Вакансии") } : null,
                        gallery.length > 0 ? { id: "4", text: p("Фото") } : null,
                        videos.length > 0 ? { id: "5", text: p("Видео") } : null,
                        certificates.length > 0 ? { id: "6", text: p("Сертификаты") } : null,
                        { id: "3", text: p("Отзывы") },
                    ].filter((item) => item !== null)}
                >
                    {actions("max-h-9 max-w-[150px]")}
                </SectionSubmenu>

                <div className="flex w-full max-w-[1200px] flex-col items-center self-center pt-10 pb-[100px]">
                    <div className="w-full">
                        {blank && <p className="text-caption">{p("Пользователь не указал информацию о себе")}</p>}
                        {profile.aboutMe && (
                            <div id="1">
                                <SectionTitle>{p("О себе")}</SectionTitle>
                                <p className="mt-5 whitespace-pre-line break-words">{profile.aboutMe}</p>
                            </div>
                        )}
                        {volunteer?.externalInfo && (
                            <div className="mt-10">
                                <SectionTitle>{p("Дополнительная информация")}</SectionTitle>
                                <p className="mt-5 whitespace-pre-line break-words">{volunteer.externalInfo}</p>
                            </div>
                        )}
                        {organization?.kind === "ok" && profile.hostId && (
                            <OfferOrganization
                                name={organization.organization.name}
                                // Старый фронт показывал тип как есть, без перевода
                                type={organization.organization.type ?? ""}
                                image={mediaUrl(organization.organization.avatar, "small")}
                                href={routes.organization(locale, profile.hostId)}
                                labels={{ title: tOffer("personalOffer.Организация"), more: tOffer("personalOffer.Подробнее") }}
                            />
                        )}
                        {(skills.length > 0 || additionalSkills.length > 0) && (
                            <div id="skills" className="mt-10 flex flex-col gap-10">
                                {skills.length > 0 && (
                                    <div className="flex w-full flex-col gap-5">
                                        <SectionTitle>{p("Умения")}</SectionTitle>
                                        <IconGrid>
                                            {skills.map((skill, index) => (
                                                <IconText key={skill.id} icon={<RemoteSvg svg={svgs[index] ?? null} className="h-5 w-5" />} text={skillName(skill.name, t)} />
                                            ))}
                                        </IconGrid>
                                    </div>
                                )}
                                {additionalSkills.length > 0 && (
                                    <div className="flex w-full flex-col gap-5">
                                        <SectionTitle>{p("Дополнительные умения")}</SectionTitle>
                                        <IconGrid>
                                            {additionalSkills.map((skill, index) => (
                                                 
                                                <IconText key={index} icon={<MaskIcon name="success" className="h-5 w-5" />} text={skill} />
                                            ))}
                                        </IconGrid>
                                    </div>
                                )}
                            </div>
                        )}
                        {languages.length > 0 && (
                            <div className="mt-10">
                                <SectionTitle>{p("Языки")}</SectionTitle>
                                <div className="mt-5">
                                    <div className="text-[16px] font-medium">
                                        {(() => {
                                            const value = languagesText(languages as { language: string; languageLevel: string }[], tOffer);
                                            return Array.isArray(value) ? value.map((item, index) => (
                                                 
                                                <span key={index}>
                                                    <span className="text-black">{item.language}</span>/<span className="text-caption">{item.level}</span>
                                                    {index < value.length - 1 && ", "}
                                                </span>
                                            )) : value;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}
                        {volunteer && participated.length > 0 && (
                            <div id="2" className="mt-10 w-full">
                                <SectionTitle>{p("Вакансии")}</SectionTitle>
                                <VolunteerOffers
                                    ids={participated}
                                    initial={offers}
                                    offerHref={routes.offer(locale, "{id}")}
                                    categories={categoryLabels(t)}
                                    labels={{
                                        empty: p("У волонтера пока нет вакансий в которых он участвовал"),
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
                        )}
                        <VolunteerReviews
                            volunteerId={id}
                            labels={{
                                title: p("Отзывы"),
                                error: p("Произошла ошибка загрузки отзывов"),
                                showNext: tOffer("personalOffer.Посмотреть следующие"),
                                gallery: { close: t("Закрыть"), photo: t("gallery.photo"), ...sliderLabels },
                            }}
                        />
                        {gallery.length > 0 && (
                            <div id="4" className="mt-10 flex flex-col gap-5">
                                <SectionTitle>{p("Фото")}</SectionTitle>
                                <GalleryCarousel images={gallery} labels={{ open: t("gallery.open"), photo: t("gallery.photo"), close: t("Закрыть"), ...sliderLabels }} />
                            </div>
                        )}
                        {videos.length > 0 && (
                            <div id="5" className="mt-10 flex flex-col gap-5">
                                <SectionTitle>{p("Видео")}</SectionTitle>
                                <VideoCarousel videos={videos} labels={{ ...sliderLabels, video: p("Видео"), unsupported: t("Неподдерживаемая ссылка на видео") }} />
                            </div>
                        )}
                        {certificates.length > 0 && (
                            <div id="6" className="mt-10 flex w-full flex-col gap-5">
                                <SectionTitle>{p("Сертификаты")}</SectionTitle>
                                <CertificatesCarousel files={certificates} labels={{ ...sliderLabels, file: p("Сертификаты") }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicShell>
    );
}
