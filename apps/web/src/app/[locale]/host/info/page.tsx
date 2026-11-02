import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { HostDescriptionForm } from "@/components/cabinet/host/HostDescriptionForm";
import { HostUpsellBanner } from "@/components/cabinet/host/HostUpsellBanner";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { hostMenu } from "@/lib/cabinetMenus";
import { hostDescriptionLabels, hostUpsellLabels } from "@/lib/hostCabinet";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.hostInfo(locale), "main.sidebar.Описание") : {};
}

/** Кабинет организатора: описание организации (HostMainInfoPage старого фронта) */
export default async function HostInfoPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, th, labels, upsell] = await Promise.all([
        getTranslator(locale),
        getTranslator(locale, "host"),
        hostDescriptionLabels(locale),
        hostUpsellLabels(locale, "consultation"),
    ]);
    return (
        <CabinetShell locale={locale} items={hostMenu(locale, t)} need="host" fitContent>
            <main className="flex w-full flex-col gap-10 pb-[4.125rem] down-1000:mx-auto down-1000:items-center down-1000:justify-center down-1000:gap-0">
                <h2 className="text-[1.625rem] font-normal down-1000:text-center">{th("hostDescription.Основная информация")}</h2>
                <HostDescriptionForm
                    organizationHref={routes.organization(locale, "{id}")}
                    infoHref={routes.hostInfo(locale)}
                    aside={<HostUpsellBanner locale={locale} vertical labels={upsell} />}
                    labels={labels}
                />
            </main>
        </CabinetShell>
    );
}
