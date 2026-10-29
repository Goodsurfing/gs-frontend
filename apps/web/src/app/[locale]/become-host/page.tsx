import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HostReviewsSlider } from "@/components/home/HostReviewsSlider";
import { PublicShell } from "@/components/layout/PublicShell";
import { Reveal } from "@/components/ui/Reveal";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getFeaturedReviews } from "@/lib/home";
import { mediaUrl } from "@/lib/media";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "seo");
    return pageMetadata({ locale, path: routes.becomeHost(locale), title: t("becomeHost.title"), description: t("becomeHost.description") });
}

const IMG = "/web/images/become-host";

const INVITE = [
    "Национальные парки и заповедники, любое ООПТ", "Археологические экспедиции", "Фермы и экопоселения",
    "Туристические станции, глемпинги и хостелы", "Некоммерческие организации", "Центры работы с детьми",
];
const HOW_CAN_HELP = [
    { title: "Своим трудом", marks: ["Копать и строить", "Работать с гостями", "Ухаживать за растениями и животными ", "Помогать с готовкой", "И многое другое"] },
    { title: "Своей профессией и навыками", marks: ["Снимать фото и видео", "Как профессиональный инженер или архитектор ", "Наблюдать за птицами и животными ", "Как врач или медсестра", "И многое другое"] },
    { title: "Интеллектуальными усилиями", marks: ["Переводить документы и материалы", "Вести социальные сети ", "Обучать участников проекта знаниям и языкам", "Руководить"] },
];
const BETTER = [
    { title: "Проведение мероприятий", marks: ["Экскурсии и туры", "Вечеринки", "Местные праздники"] },
    { title: "Обучение", marks: ["Познавательные лекции", "Обучение делу в проекте", "Языки", "Йога"] },
    { title: "Помощь с транспортом", marks: ["Оплата проезда", "Трансфер до проекта с вокзала / аэропорта", "Предоставить велосипед"] },
];
// Подписи в старом фронте перепутаны (под всеми пятью значками — названия из другого блока); оставлены как есть
const WHY = ["Проведение мероприятий", "Обучение", "Помощь с транспортом", "Помощь с транспортом", "Помощь с транспортом"];

const h2 = "text-center text-[26px] font-normal";
const lead = "mx-auto max-w-[875px] text-center text-[18px] font-medium";
const green = "w-max rounded-[10px] border border-cta bg-cta px-[50px] py-2.5 text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-cta";
const blue = "mx-auto w-max rounded-[10px] border border-primary bg-primary px-[50px] py-2.5 text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary";

/** «Стать организатором» (BecomeHostPage старого фронта, GS-219) */
export default async function BecomeHostPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tCommon, reviews] = await Promise.all([getTranslator(locale, "become-host"), getTranslator(locale), getFeaturedReviews(locale)]);
    const role = routes.profileRole(locale);

    const marks = (items: { title: string; marks: string[] }[], prefix: string, light: boolean) => (
        <div className={`mx-auto grid w-full max-w-[1180px] grid-cols-3 gap-x-2.5 gap-y-5 px-10 max-[1200px]:grid-cols-2 down-sm:grid-cols-1 down-sm:px-5 ${light ? "text-white" : ""}`}>
            {items.map((item, index) => (
                <div key={item.title}>
                    <div className="flex items-center gap-2.5">
                        <span className="block">
                            {/* eslint-disable-next-line @next/next/no-img-element -- иллюстрация */}
                            <img src={`${IMG}/${prefix}${index + 1}.svg`} alt="" className="inline" />
                        </span>
                        <span className="text-[18px] font-medium">{t(item.title)}</span>
                    </div>
                    <ul className="pt-5">
                        {item.marks.map((mark) => <li key={mark} className="text-[14px] leading-[160%] font-medium">{t(mark)}</li>)}
                    </ul>
                </div>
            ))}
        </div>
    );

    return (
        <PublicShell locale={locale} topGap>
            <div className="flex flex-col gap-20">
                <section
                    className="mx-auto box-border flex min-h-[624px] w-full max-w-[1920px] flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-40 py-24 down-lg:min-h-[424px] down-lg:p-5"
                    style={{ backgroundImage: `url(${IMG}/becomeHost.webp)` }}
                >
                    <h1 className="max-w-[33rem] text-center text-[1.875rem] leading-[3rem] font-bold text-white">
                        {t("Принимай у себя гудсёрферов и с их поддержкой развивай свой проект!")}
                    </h1>
                    <h2 className="mt-10 max-w-[770px] text-center text-[18px] font-normal text-white">
                        {t("Зарегистрируйтесь в сервисе Goodsurfing и получите возможность привлекать добровольных помощников со всего мира")}
                    </h2>
                    <div className="mt-[60px] flex gap-7"><a href={role} className={green}>{t("Стать хостом")}</a></div>
                </section>

                <div className="flex flex-col gap-9 max-[1200px]:px-5">
                    <h2 className={h2}>{t("Кто может приглашать гудсёрферов")}</h2>
                    <p className={lead}>{t("Хост – международный термин обозначающий сторону, которая принимает добровольных помощников у себя для реализации какого-либо проекта.")}</p>
                    <div className="mx-auto grid w-full max-w-[1180px] grid-cols-3 items-baseline gap-x-2.5 gap-y-10 down-lg:grid-cols-2">
                        {INVITE.map((text, index) => (
                            <Reveal key={text} from="up" className="flex flex-col items-center justify-center">
                                {/* Строчная картинка в блоке — как react-svg старого фронта (+3 px под строкой) */}
                                <span className="block">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иллюстрация */}
                                    <img src={`${IMG}/inviteVolunteer${index + 1}.svg`} alt="" className="inline" />
                                </span>
                                <span className="text-center">{t(text)}</span>
                            </Reveal>
                        ))}
                    </div>
                </div>

                <div className="mx-auto box-border flex min-h-[521px] w-full max-w-[1920px] flex-col gap-[30px] bg-cover bg-center bg-no-repeat py-[60px] text-white max-[1200px]:px-5 max-[1200px]:py-10" style={{ backgroundImage: `url(${IMG}/back.webp)` }}>
                    <h2 className={h2}>{t("Чем могут помочь гудсёрферы")}</h2>
                    <p className={lead}>{t("Гудсёрферы – это добровольные помощники, которые готовы приехать к вам из любых регионов и стран и приложить свои усилия для развития вашего проекта.")}</p>
                    {marks(HOW_CAN_HELP, "howCanHelp", true)}
                </div>

                <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-[50px] max-[1200px]:px-5">
                    <div className="flex flex-col gap-9">
                        <h2 className={h2}>{t("Что вы предлагаете взамен")}</h2>
                        <p className={lead}>{t("Нужно понимать, что работа с гудсёрферами, как и с волонтёрами – это взаимный процесс. Чем больше вы сможете предложить, тем более вероятно вы сможете привлечь талантливых и трудолюбивых гудсёрферов.")}</p>
                    </div>
                    <div className="mx-auto flex max-w-[830px] gap-x-[50px] gap-y-5 down-lg:flex-col">
                        {[["25 часов", "помощи в неделю в среднем запрашивают наши хосты"], ["На 2-4 недели", "в среднем приглашают гудсёрферов"]].map(([circle = "", text = ""], index) => (
                            <div key={circle} className={`flex flex-1 items-center gap-5 ${index === 0 ? "border-r border-caption down-lg:border-r-0" : ""}`}>
                                <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-full bg-field">
                                    <span className="font-medium text-primary">{t(circle)}</span>
                                </div>
                                <span className="text-[16px]">{t(text)}</span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <p className={lead}>{t("Основой является предложение питания, проживания и культурный обмен")}</p>
                        <div className="mt-[30px] grid grid-cols-3 gap-[30px] down-lg:grid-cols-2 down-sm:grid-cols-1">
                            {[
                                { title: "Проживание", list: ["Отдельный дом", "Комната", "Койко-место", "Палатка", "Место под палатку"] },
                                { title: "Питание", list: ["Полный пансион", "Завтрак включен", "Продукты", "Вегетарианское"] },
                                { title: "Культурный обмен", text: "Взаимодействие и взаимное развитие между волонтерами и принимающей стороной" },
                            ].map((item, index) => (
                                <div key={item.title} className="flex flex-col gap-[30px]">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иллюстрация */}
                                    <img src={`${IMG}/whatReturn${index + 1}.webp`} alt="" className="w-full" />
                                    <p className="text-left text-[18px] font-medium">{t(item.title)}</p>
                                    {item.list ? (
                                        <ul className="list-inside list-disc">{item.list.map((li) => <li key={li}>{t(li)}</li>)}</ul>
                                    ) : <span>{t(item.text ?? "")}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mx-auto flex min-h-[521px] w-full max-w-[1920px] flex-col gap-[30px] bg-field py-[60px] max-[1200px]:px-5 max-[1200px]:py-10">
                    <h2 className={h2}>{t("Чтобы сделать ваш проект лучше")}</h2>
                    <p className={lead}>{t("Гудсёрферы – это добровольные помощники, которые готовы приехать к вам из любых регионов и стран и приложить свои усилия для развития вашего проекта.")}</p>
                    {/* Отступ снизу 30 px; до 576 px старый стиль «padding: 0 20px» его обнулял */}
                    <div className="pb-[30px] down-sm:pb-0">{marks(BETTER, "betterProject", false)}</div>
                    <a href={role} className={blue}>{t("Стать хостом")}</a>
                </div>

                <div className="mx-auto box-border flex min-h-[391px] w-full max-w-[1920px] flex-col gap-[30px] bg-cover bg-center bg-no-repeat py-[60px] text-white down-sm:px-5" style={{ backgroundImage: `url(${IMG}/whoIsGoodsurfers.webp)` }}>
                    <h2 className={h2}>{t("Кто такие гудсёрферы")}</h2>
                    <p className={lead}>
                        {t("Гудсёрферы – это люди из разных регионов и стран, которые готовы приложить свои знания и труд на проживание, питание и опыт. Это люди разных возрастов, пола и профессий.")}
                        <br />
                        <br />
                        <b>{t("Найдите своих идеальных гудсёрферов!")}</b>
                    </p>
                    <a href={role} className={`${green} mx-auto`}>{t("Начать сейчас")}</a>
                </div>

                <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-[50px] bg-ink px-[370px] py-20 max-[1600px]:p-20 max-[1200px]:p-10">
                    <h2 className={`${h2} text-white`}>{t("Зачем пользоваться Гудсёрфингом")}</h2>
                    <div className="flex flex-wrap items-center justify-center gap-x-[30px] gap-y-[60px]">
                        {WHY.map((title, index) => (
                             
                            <Reveal key={index} from={index % 2 === 0 ? "up" : "down"} className="flex w-full max-w-[370px] flex-col items-center text-center">
                                <span className="block">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иллюстрация */}
                                    <img src={`${IMG}/whyUseIt${index + 1}.svg`} alt="" className="inline" />
                                </span>
                                <span className="text-[18px] text-white">{t(title)}</span>
                            </Reveal>
                        ))}
                    </div>
                </div>

                <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-5 px-[120px] pb-[50px] max-[1200px]:px-5">
                    {reviews.length > 0 && (
                        <>
                            <h2 className={h2}>{t("Отзывы о хостах")}</h2>
                            <HostReviewsSlider
                                labels={{ prev: tCommon("slider.previous"), next: tCommon("slider.next") }}
                                reviews={reviews.map((review) => ({
                                    id: String(review.id),
                                    title: review.title,
                                    text: review.description,
                                    image: mediaUrl(review.images[0], "large"),
                                    author: review.authorName,
                                    avatar: mediaUrl(review.authorAvatar, "small"),
                                    href: routes.offer(locale, review.vacancyId),
                                }))}
                            />
                        </>
                    )}
                    {/* Длинная надпись: fit-content, как в старом фронте — на телефоне переносится */}
                    <a href={role} className={`${blue} w-fit! text-center`}>{t("Начните принимать волонтеров со всей России и мира")}</a>
                </div>
            </div>
        </PublicShell>
    );
}
