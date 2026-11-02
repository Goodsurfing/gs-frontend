import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { FundraiseWhere } from "@/components/fundraise-wizard/FundraiseSteps";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { fundraiseMenu } from "@/lib/cabinetMenus";
import { fundraiseStepTitle, fundraiseWhereLabels } from "@/lib/fundraiseWizard";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.fundraiseStep(locale, "where", id), "main.sidebar.Сборы") : {};
}

/** Мастер сбора, шаг «Где» (FundraiseStepPage старого фронта) */
export default async function FundraiseStepPage({ params }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const [t, title, labels] = await Promise.all([getTranslator(locale), fundraiseStepTitle(locale, "where"), fundraiseWhereLabels(locale)]);
    return (
        <CabinetShell locale={locale} items={fundraiseMenu(locale, t, id)} need="host">
            <main className="w-full max-w-[1280px]">
                <h1 className="text-[1.625rem] leading-[120%] font-normal text-ink-secondary down-lg:text-center">{title}</h1>
                <FundraiseWhere id={id} locale={locale} labels={labels} />
            </main>
        </CabinetShell>
    );
}
