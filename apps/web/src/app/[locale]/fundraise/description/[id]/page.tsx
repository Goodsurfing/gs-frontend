import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { FundraiseDescription } from "@/components/fundraise-wizard/FundraiseSteps";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { fundraiseMenu } from "@/lib/cabinetMenus";
import { fundraiseStepTitle, fundraiseDescriptionLabels } from "@/lib/fundraiseWizard";
import { getFilterCategories } from "@/lib/offersFilterOptions";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.fundraiseStep(locale, "description", id), "main.sidebar.Сборы") : {};
}

/** Мастер сбора, шаг «Описание» (FundraiseStepPage старого фронта) */
export default async function FundraiseStepPage({ params }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const [t, title, labels, categories] = await Promise.all([getTranslator(locale), fundraiseStepTitle(locale, "description"), fundraiseDescriptionLabels(locale), getFilterCategories(locale)]);
    return (
        <CabinetShell locale={locale} items={fundraiseMenu(locale, t, id)} need="host">
            <main className="w-full max-w-[1280px]">
                <h1 className="text-[1.625rem] leading-[120%] font-normal text-ink-secondary down-lg:text-center">{title}</h1>
                <FundraiseDescription id={id} locale={locale} categories={categories} labels={labels} />
            </main>
        </CabinetShell>
    );
}
