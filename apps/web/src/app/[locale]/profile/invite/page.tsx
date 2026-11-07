import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { InviteFriend, type InviteFriendLabels } from "@/components/referral/InviteFriend";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { profileMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

const KEYS = ["intro", "linkLabel", "copy", "copied", "share", "shareText", "invited", "none", "badge", "badgeDone", "error", "retry"] as const satisfies readonly (keyof InviteFriendLabels)[];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.profileInvite(locale), "main.sidebar.Пригласить друга") : {};
}

/** Кабинет: «Пригласить друга» — ссылка, «поделиться», счётчик; награда — значок «Рекомендатор» */
export default async function ProfileInvitePage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    const labels = Object.fromEntries(KEYS.map((key) => [key, t(`referral.${key}`, { count: "{{count}}" })])) as Record<(typeof KEYS)[number], string>;
    return (
        <CabinetShell locale={locale} items={profileMenu(locale, t)}>
            <main className="w-full">
                <h2 className="text-[1.625rem] font-normal">{t("referral.title")}</h2>
                <InviteFriend achievementsHref={routes.achievements(locale)} labels={labels} />
            </main>
        </CabinetShell>
    );
}
