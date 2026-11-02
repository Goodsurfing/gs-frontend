import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OfferWizardShell, offerWizardMetadata } from "@/components/offer-wizard/OfferWizardShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { parseOfferId } from "@/lib/offerWizard";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    return isLocale(locale) && offerId ? offerWizardMetadata(locale, "welcome", offerId) : {};
}

/** Мастер вакансии: приветствие (OfferWelcomePage старого фронта) — сюда ведёт «Добавить вакансию» */
export default async function OfferWelcomePage({ params }: Props) {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    if (!isLocale(locale) || !offerId) notFound();
    const t = await getTranslator(locale, "offer");
    return (
        <OfferWizardShell locale={locale} id={offerId}>
            <h1 className="text-[2em] font-bold text-black down-lg:text-center">{t("welcome.Привет!")}</h1>
            <p className="mt-10 max-w-[720px] text-[14px] leading-[22px] text-ink-secondary down-lg:text-center">
                {t("welcome.Здесь вы можете создать и добавить на сайт свое мероприятие. А между тем мы будем предлагать вам полезные советы и примеры.")}
            </p>
            <p className="mt-5 max-w-[720px] text-[14px] leading-[22px] text-ink-secondary down-lg:text-center">
                {t("welcome.Теперь на сайте можно проводить мероприятия, поэтому мы рады, что вас заинтересовало это и вы хотите присоединиться к растущему сообществу гудсёрферов. Нам не терпится взглянуть, чем вы нас обрадуете.")}
            </p>
            <a
                href={routes.offerStep(locale, "where", offerId)}
                className="mt-[60px] inline-block rounded-[10px] bg-primary px-[100px] py-3 text-center text-[16px] leading-[22px] text-white no-underline transition-all duration-300 hover:bg-primary-hover down-lg:w-full down-lg:px-3"
            >
                {t("welcome.Начать")}
            </a>
        </OfferWizardShell>
    );
}
