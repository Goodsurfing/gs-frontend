import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RequireUser } from "@/components/cabinet/RequireUser";
import { VkEmailPrompt } from "@/components/email-change/VkEmailPrompt";
import { PublicShell } from "@/components/layout/PublicShell";
import { Messenger } from "@/components/messenger/Messenger";
import { ReportProvider } from "@/components/report/ReportContext";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { categoryLabels } from "@/lib/categories";
import { LANGUAGES, LEVELS, skillNames } from "@/lib/offerText";
import { vkEmailPromptLabels } from "@/lib/emailChangeLabels";
import { reportLabels } from "@/lib/report";
import { routes } from "@/lib/routes";
import { iosInstallHintLabels } from "@/lib/pwaLabels";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const [tm, tMain] = await Promise.all([getTranslator(locale, "messenger"), getTranslator(locale, "main")]);
    return pageMetadata({ locale, path: routes.messenger(locale), title: `${tm("Сообщения")} — GoodSurfing`, description: tMain("seo.description"), noindex: true });
}

/**
 * Сообщения (MessengerPage старого фронта): /messenger — список, /messenger/:id —
 * переписка, /messenger/create/:offerId — отклик на вакансию,
 * /messenger/create?recipientVolunteer=… — первое сообщение. Только для вошедших.
 */
export default async function MessengerPage({ params }: Props) {
    const { locale, slug = [] } = await params;
    if (!isLocale(locale) || slug.length > 2) notFound();
    const [chatId, offerId] = slug;
    const [t, tm, tOffer, tPwa, tReport] = await Promise.all([getTranslator(locale), getTranslator(locale, "messenger"), getTranslator(locale, "offer"), getTranslator(locale, "pwa"), getTranslator(locale, "report")]);
    const m = (key: string) => tm(key);
    const dict = {
        skills: skillNames(t),
        languages: Object.fromEntries(Object.entries(LANGUAGES).map(([code, key]) => [code, tOffer(`whoNeeds.${key}`)])),
        levels: Object.fromEntries(Object.entries(LEVELS).map(([code, key]) => [code, tOffer(`whoNeeds.${key}`)])),
        categories: categoryLabels(t),
    };
    return (
        <PublicShell locale={locale} headerVariant="static" footer={false}>
            <RequireUser locale={locale} />
            {/* Вошёл через VK без почты — не узнает по почте, что организатор ответил */}
            <VkEmailPrompt signInHref={routes.signIn(locale)} labels={vkEmailPromptLabels(t)} className="mx-auto mt-5 max-w-[1400px] down-md:mx-4 down-md:w-auto" />
            {/* useSearchParams — получатель первого сообщения в адресе */}
            <Suspense fallback={null}>
                <ReportProvider labels={reportLabels(tReport)}>
                    <Messenger
                        locale={locale}
                        chatId={chatId}
                        offerId={offerId}
                        dict={dict}
                        hrefs={{
                            messenger: routes.messenger(locale),
                            chat: routes.messengerChatTemplate(locale),
                            offer: routes.offerTemplate(locale),
                            volunteer: routes.volunteerPublicTemplate(locale),
                            organization: routes.organizationTemplate(locale),
                            catalog: routes.offersMap(locale),
                            blocked: `${routes.profilePrivacy(locale)}#blocked`,
                        }}
                        labels={{
                            title: m("Сообщения"),
                            choose: m("Выберите, кому хотели бы написать"),
                            emptyVolunteer: { title: m("empty.volunteer"), hint: m("empty.volunteerHint"), find: m("empty.find") },
                            back: t("Назад"),
                            info: m("Информация"),
                            decisionPrompt: m("Новая заявка — примите или отклоните её, волонтёр ждёт ответа"),
                            declineConfirm: m("Отклонить заявку? Волонтёр получит уведомление"),
                            cancel: m("Отмена"),
                            changeDecision: m("Изменить решение"),
                            changePrompt: m("Измените решение по заявке — волонтёр получит уведомление"),
                            offerNotFound: m("Вакансия не была найдена"),
                            applicationSent: m("Заявка успешно отправлена"),
                            sendError: m("Произошла ошибка при отправке сообщения"),
                            error: m("Произошла ошибка"),
                            close: t("Закрыть"),
                            list: {
                                search: t("Поиск"),
                                tabs: { all: m("Все"), unread: m("Непрочитанные"), awaiting: m("Ждут ответа"), accepted: m("Принятые") },
                                statuses: { incoming: m("Новая заявка"), sent: m("Заявка отправлена"), accepted: m("Принята"), canceled: m("Отклонена") },
                                you: m("Вы:"),
                                read: m("Прочитано"),
                                attachment: m("Прикрепленный файл"),
                                application: m("Заявка"),
                                noDate: "",
                                noName: "",
                                empty: m("Переписок пока нет"),
                                emptyTab: m("Здесь пока пусто"),
                                emptyTabs: {
                                    unread: m("Здесь будут переписки с сообщениями, которые вы ещё не прочитали"),
                                    awaiting: m("Здесь будут переписки, где последнее сообщение — от собеседника"),
                                    accepted: m("Здесь будут переписки с подтверждёнными заявками"),
                                },
                                loadError: m("Не удалось загрузить переписки"),
                                retry: m("Повторить"),
                            },
                            input: {
                                placeholder: m("Написать сообщение"),
                                attach: m("Прикрепленный файл"),
                                emoji: m("Смайлы"),
                                send: t("Отправить"),
                                removeAttachment: t("Удалить"),
                                tooLarge: m("Файл слишком большой. Максимальный размер: 5MB"),
                                uploadError: m("Произошла ошибка"),
                                emojiSmileys: m("Смайлы"),
                                emojiAnimals: m("Животные"),
                                emojiFood: m("Еда"),
                                emojiSearch: t("Поиск"),
                            },
                            application: {
                                applied: m("подал заявку на вакансию"),
                                accept: m("Принять"),
                                decline: m("Отклонить"),
                                card: {
                                    more: t("Подробнее"),
                                    notOnMap: t("нет на карте"),
                                    reviews: t("Отзывов"),
                                    went: t("Отправились"),
                                    noTitle: t("Без заголовка"),
                                    noDescription: t("Без описания"),
                                },
                            },
                            // Форма отклика (GS-290)
                            apply: {
                                title: m("apply.title"),
                                when: m("apply.when"),
                                projectDates: m("apply.projectDates"),
                                fullYear: m("apply.fullYear"),
                                minStay: m("apply.minStay"),
                                maxStay: m("apply.maxStay"),
                                days: { one: m("apply.days_one"), few: m("apply.days_few"), many: m("apply.days_many"), other: m("apply.days_other") },
                                choosePeriod: m("apply.choosePeriod"),
                                windowHint: m("apply.windowHint"),
                                freeHint: m("apply.freeHint"),
                                arrival: m("Прибытие"),
                                departure: m("Отъезд"),
                                notSet: t("Не задано"),
                                about: m("apply.about"),
                                optional: m("apply.optional"),
                                aboutPlaceholder: m("apply.aboutPlaceholder"),
                                aboutHint: m("apply.aboutHint"),
                                submit: m("apply.submit"),
                                sending: m("apply.sending"),
                                needPeriod: m("apply.needPeriod"),
                                loadError: m("apply.loadError"),
                                retry: m("apply.retry"),
                                card: {
                                    more: t("Подробнее"),
                                    notOnMap: t("нет на карте"),
                                    reviews: t("Отзывов"),
                                    went: t("Отправились"),
                                    noTitle: t("Без заголовка"),
                                    noDescription: t("Без описания"),
                                },
                            },
                            applyNetworkError: m("apply.network"),
                            draft: {
                                suggest: m("Предложить ответ"),
                                writing: m("Пишу черновик…"),
                                hint: m("Это черновик — проверьте и поправьте перед отправкой"),
                                limit: m("Помощник на сегодня устал — попробуйте завтра"),
                                failed: m("Не получилось предложить ответ, попробуйте ещё раз"),
                            },
                            intro: {
                                title: m("intro.title"),
                                text: m("intro.text"),
                                name: m("intro.name"),
                                save: m("intro.save"),
                                saved: m("intro.saved"),
                                photo: m("intro.photo"),
                                uploading: m("intro.uploading"),
                                error: m("intro.error"),
                            },
                            // Подстановки {{…}} заполняет браузер — словарь их не трогает
                            hint: {
                                from: m("hint.from"),
                                responsive: tm("hint.responsive", { percent: "{{percent}}" }),
                                period: tm("hint.period", { period: "{{period}}" }),
                                hours: tm("hint.hours", { count: "{{count}}" }),
                                days: tm("hint.days", { count: "{{count}}" }),
                                slow: m("hint.slow"),
                                new: m("hint.new"),
                                close: tm("hint.close", { days: "{{days}}" }),
                            },
                            push: {
                                text: m("Включите уведомления — узнаете о новых сообщениях и заявках сразу, даже когда сайт закрыт"),
                                enable: m("Включить"),
                                later: m("Не сейчас"),
                                iosText: m("На iPhone уведомления о сообщениях приходят, если добавить сайт на экран «Домой»: «Поделиться» → «На экран „Домой“»"),
                                ok: m("Понятно"),
                                enabled: m("Уведомления включены"),
                                blocked: m("Браузер не разрешил уведомления — их можно включить в настройках сайта"),
                                unsupported: m("Этот браузер не умеет получать уведомления. Откройте сайт в Chrome, Яндекс Браузере, Safari или Firefox — на iPhone добавьте сайт на экран «Домой»"),
                                noPrompt: m("Окно браузера не появилось? Нажмите на значок слева от адреса сайта (замок или перечёркнутый колокольчик) и разрешите уведомления"),
                                install: iosInstallHintLabels(tPwa),
                                appHref: routes.app(locale),
                            },
                            companion: {
                                title: m("Информация"),
                                close: t("Закрыть"),
                                volunteer: m("Волонтёр"),
                                host: m("Организатор"),
                                viewOrganization: m("Посмотреть организацию"),
                                skills: m("Умения"),
                                noSkills: m("Волонтёр не указал умения"),
                                languages: m("Владение языками"),
                                noLanguages: m("Языки не были указаны"),
                                projects: m("Участвовал в проектах:"),
                                noProjects: m("Волонтёр не участвовал в проектах"),
                                loading: m("Загрузка..."),
                            },
                        }}
                    />
                </ReportProvider>
            </Suspense>
        </PublicShell>
    );
}
