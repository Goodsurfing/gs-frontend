import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { offerWizardMenu, type OfferStep } from "@/lib/offerWizard";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

/** Подпись шага в меню — она же заголовок вкладки */
const TITLE_KEY: Record<OfferStep, string> = {
    welcome: "main.sidebar.К предложениям",
    where: "main.sidebar.Где",
    when: "main.sidebar.Когда",
    "who-needs": "main.sidebar.Кто нужен",
    description: "main.sidebar.Описание",
    "what-to-do": "main.sidebar.Что делать",
    conditions: "main.sidebar.Условия",
    "finishing-touches": "main.sidebar.Последние штрихи",
};

/** Метаданные шага: служебная страница, в поиск не попадает */
export async function offerWizardMetadata(locale: Locale, step: OfferStep, id: string): Promise<Metadata> {
    const [t, tMain] = await Promise.all([getTranslator(locale), getTranslator(locale, "main")]);
    return pageMetadata({ locale, path: routes.offerStep(locale, step, id), title: `${t(TITLE_KEY[step])} — GoodSurfing`, description: tMain("seo.description"), noindex: true });
}

/**
 * Каркас шага мастера вакансии (OfferLayoutPage старого фронта): кабинет с
 * меню шагов, только для вошедших — как PrivateRouteGuard старого фронта.
 */
export async function OfferWizardShell({ locale, id, children }: { locale: Locale; id: string; children: ReactNode }) {
    const t = await getTranslator(locale);
    return (
        <CabinetShell locale={locale} items={offerWizardMenu(locale, t, id)}>
            <main className="w-full max-w-[1280px]">{children}</main>
        </CabinetShell>
    );
}
