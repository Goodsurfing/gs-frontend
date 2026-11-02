"use client";

import { useEffect, useState } from "react";

import { MemberBanner } from "@/components/content/MemberBanner";
import { useSession } from "@/components/session/SessionProvider";
import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";
import { hasHostMembership } from "@/lib/occupancy";

const SUPPORT_EMAIL = "support@goodsurfing.org";

/**
 * Допродажа организатору (features/HostUpsellBanner старого фронта, GS-151):
 * без членства — баннер «Оформи членство», с членством — как получить
 * консультацию или медиаподдержку: письмо в поддержку с готовой темой.
 */
export function HostUpsellBanner({ locale, vertical = false, labels }: {
    locale: Locale;
    vertical?: boolean;
    labels: {
        /** Тема письма до « - название организации» */
        subject: string;
        memberTitle: string;
        memberButton: string;
        canGet: string;
        withSubject: string;
        /** «ответ в течение N рабочих дней» */
        answer: string;
    };
}) {
    const session = useSession();
    const [state, setState] = useState<{ member: boolean; name: string } | null>(null);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        const api = browserApi(session.token);
        void Promise.all([
            api.GET("/api/v1/profile/occupancy").catch(() => null),
            api.GET("/api/v1/personal/organization").catch(() => null),
        ]).then(([occupancy, organization]) => {
            if (cancelled || !occupancy?.data) return;
            setState({ member: hasHostMembership(occupancy.data), name: organization?.data?.name ?? "" });
        });
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token]);

    if (!state) return null;
    if (!state.member) return <MemberBanner locale={locale} title={labels.memberTitle} button={labels.memberButton} anchor="host" vertical={vertical} />;

    const subject = `${labels.subject} - ${state.name}`;
    return (
        <div className={`rounded-[12px] bg-card px-5 py-4 ${vertical ? "max-w-[240px] down-lg:max-w-full" : ""}`}>
            <p className="text-[14px] leading-[150%] text-ink-secondary">
                {labels.canGet}
                {" "}
                <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`} className="text-primary underline">{SUPPORT_EMAIL}</a>
                {" "}
                {labels.withSubject}
                {" «"}
                {subject}
                {"», "}
                {labels.answer}
            </p>
        </div>
    );
}
