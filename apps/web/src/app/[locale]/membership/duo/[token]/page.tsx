import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { duoLabels } from "@/components/membership/duo";
import { DuoInvite } from "@/components/membership/DuoInvite";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, token } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "membership");
    // Ссылка личная — не индексировать
    return pageMetadata({ locale, path: routes.membershipDuo(locale, token), title: t("duo.seo-title"), description: t("duo.offer-text"), noindex: true });
}

/** Приглашение в членство «на двоих» по ссылке от покупателя */
export default async function MembershipDuoInvitePage({ params }: Props) {
    const { locale, token } = await params;
    if (!isLocale(locale) || !/^[a-f0-9]{16,64}$/.test(token)) notFound();
    const t = await getTranslator(locale, "membership");
    return (
        <PublicShell locale={locale} topGap>
            <DuoInvite
                token={token}
                signInHref={`${routes.signIn(locale)}?next=duo&nextId=${token}`}
                signUpHref={routes.signUp(locale)}
                offersHref={routes.offersMap(locale)}
                labels={duoLabels(t)}
            />
        </PublicShell>
    );
}
