import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { HostBadge } from "@/components/cabinet/host/HostBadge";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { hostMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.hostBadge(locale), "main.sidebar.Значок для сайта") : {};
}

/** Кабинет организатора: значок «Мы на Гудсёрфинге» для сайта и соцсетей */
export default async function HostBadgePage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, th] = await Promise.all([getTranslator(locale), getTranslator(locale, "host")]);
    const b = (key: string) => th(`badge.${key}`);
    return (
        <CabinetShell locale={locale} items={hostMenu(locale, t)} need="host" fitContent>
            <main className="min-h-screen pb-9">
                <HostBadge
                    organizationTemplate={routes.organization(locale, "{id}")}
                    labels={{
                        title: b("title"),
                        intro: b("intro"),
                        preview: b("preview"),
                        codeTitle: b("code-title"),
                        codeHint: b("code-hint"),
                        copyCode: b("copy-code"),
                        copied: b("copied"),
                        download: b("download"),
                        linkTitle: b("link-title"),
                        linkHint: b("link-hint"),
                        copyLink: b("copy-link"),
                        shareText: b("share-text"),
                        noOrganization: b("no-organization"),
                    }}
                />
            </main>
        </CabinetShell>
    );
}
