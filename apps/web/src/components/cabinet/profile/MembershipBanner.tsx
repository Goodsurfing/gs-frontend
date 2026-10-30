"use client";

import { activeMembership, useSession } from "@/components/session/SessionProvider";

const small = "flex items-center justify-center rounded-[10px] border px-[50px] py-2.5 text-center text-[16px] leading-[120%] transition-all duration-300";

/**
 * Членство на странице «Обо мне» (ProfileMembershipBanner старого фронта,
 * GS-170/188/198), столбиком под аватаром: активно — «до какого числа» и
 * «Продлить»; нет — две карточки (волонтёрам, организаторам). Клуб — отдельной строкой.
 */
export function MembershipBanner({ locale, membershipHref, labels }: {
    locale: string;
    membershipHref: string;
    labels: {
        activeUntil: string;
        renew: string;
        clubUntil: string;
        renewClub: string;
        volunteers: string;
        volunteersText: string;
        hosts: string;
        hostsText: string;
        get: string;
    };
}) {
    const session = useSession();
    if (session.status !== "user") return null;
    const regular = activeMembership(session.memberships, "REGULAR");
    const club = activeMembership(session.memberships, "INTERNATIONAL");
    const date = (value?: string | null) => (value ? new Date(value).toLocaleDateString(locale === "ru" ? "ru-RU" : locale) : "");

    const clubBlock = club ? (
        <div className="flex flex-col items-center gap-4 rounded-xl bg-[#F5F5F5] px-5 py-4">
            <p className="text-center text-[14px] text-ink-secondary">{labels.clubUntil.replace("{{date}}", date(club.endDate))}</p>
            <a href={`${membershipHref}#international`} className={`${small} border-primary text-primary hover:bg-primary hover:text-white`}>{labels.renewClub}</a>
        </div>
    ) : null;

    if (regular) {
        const host = (regular.tariff as { forRole?: string } | null)?.forRole === "HOST";
        return (
            <div className="flex w-full max-w-[240px] flex-col items-center gap-4 rounded-xl bg-[#F5F5F5] px-5 py-4">
                <p className="text-center text-[14px] text-ink-secondary">{labels.activeUntil.replace("{{date}}", date(regular.endDate))}</p>
                <a href={host ? `${membershipHref}#host` : membershipHref} className={`${small} border-primary bg-primary text-white hover:bg-white hover:text-primary`}>{labels.renew}</a>
                {clubBlock}
            </div>
        );
    }
    const column = "flex flex-col gap-2 rounded-xl border-l-[3px] bg-[#F5F5F5] p-4";
    return (
        <div className="flex w-full max-w-[240px] flex-col gap-4">
            <div className={`${column} border-l-primary`}>
                <span className="text-[12px] font-bold tracking-[0.02em] text-ink-secondary uppercase">{labels.volunteers}</span>
                <p className="text-[13px] leading-[1.4] text-ink-secondary">{labels.volunteersText}</p>
                <a href={membershipHref} className={`${small} border-primary bg-primary text-white hover:bg-white hover:text-primary`}>{labels.get}</a>
            </div>
            <div className={`${column} border-l-host`}>
                <span className="text-[12px] font-bold tracking-[0.02em] text-ink-secondary uppercase">{labels.hosts}</span>
                <p className="text-[13px] leading-[1.4] text-ink-secondary">{labels.hostsText}</p>
                <a href={`${membershipHref}#host`} className={`${small} border-cta bg-cta text-white hover:bg-white hover:text-cta`}>{labels.get}</a>
            </div>
            {clubBlock}
        </div>
    );
}
