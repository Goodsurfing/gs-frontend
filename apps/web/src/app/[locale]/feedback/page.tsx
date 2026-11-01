import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { PublicShell } from "@/components/layout/PublicShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale);
    const tMain = await getTranslator(locale, "main");
    return pageMetadata({ locale, path: routes.feedback(locale), title: t("main.welcome.header.about-project.feedback"), description: tMain("seo.description") });
}

/** «Обратная связь» (FeedbackPage старого фронта, GS-219) */
export default async function FeedbackPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <PublicShell locale={locale} topGap>
            <div className="flex w-full flex-col px-5 pb-[100px]">
                <section className="flex min-h-[190px] w-full items-center justify-center bg-[linear-gradient(257deg,#EBC50C_-1.78%,#00A0A8_103.74%)]">
                    <h1 className="text-center text-[2.5rem] font-semibold text-white down-sm:text-[1.625rem]">{t("main.welcome.header.about-project.feedback")}</h1>
                </section>
                <FeedbackForm
                    labels={{
                        name: t("Ваше имя"),
                        message: t("Сообщение"),
                        send: t("Отправить"),
                        sent: t("Спасибо! Ваше сообщение отправлено."),
                        sentHint: t("Мы ответим вам на указанный email."),
                        again: t("Написать ещё раз"),
                        error: t("Не удалось отправить сообщение. Попробуйте ещё раз."),
                    }}
                />
            </div>
        </PublicShell>
    );
}
