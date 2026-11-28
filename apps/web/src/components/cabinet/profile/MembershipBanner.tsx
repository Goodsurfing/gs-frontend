"use client";

import { activeMembership, useSession } from "@/components/session/SessionProvider";

/** Строка статуса под аватаркой: обычное членство или «на двоих» (GS-294) */
export function membershipStatusText(
    membership: { endDate?: string | null; duo?: { role: "owner" | "partner"; partnerFirstName?: string | null; invitationSent?: boolean } | null },
    date: string,
    labels: { activeUntil: string; duoWith: string; duoInviteSent: string; duoInvite: string },
): { text: string; invite: boolean } {
    const fill = (template: string, values: Record<string, string>) => template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => values[key] ?? "");
    const duo = membership.duo;
    const name = duo?.partnerFirstName?.trim();
    if (duo && name) return { text: fill(labels.duoWith, { name, date }), invite: false };
    // Второй ещё не присоединился — это видит только покупатель (у второго участника имя покупателя есть всегда)
    if (duo?.role === "owner") return { text: fill(duo.invitationSent ? labels.duoInviteSent : labels.duoInvite, { date }), invite: !duo.invitationSent };
    return { text: fill(labels.activeUntil, { date }), invite: false };
}

const small = "flex items-center justify-center rounded-[10px] border px-[50px] py-2.5 text-center text-[16px] leading-[120%] transition-all duration-300";

/**
 * Членство на странице «Обо мне» (ProfileMembershipBanner старого фронта,
 * GS-170/188/198), столбиком под аватаром: активно — «до какого числа» и
 * «Продлить»; нет — две карточки (волонтёрам, организаторам). Клуб — отдельной строкой.
 * «На двоих» (GS-294) — у обоих участников «Членство на двоих с <имя> до <дата>»;
 * покупателю, пока второй не присоединился, — «приглашение отправлено» или ссылка пригласить.
 */
export function MembershipBanner({ locale, membershipHref, labels }: {
    locale: string;
    membershipHref: string;
    labels: {
        activeUntil: string;
        /** «Членство на двоих с {{name}} до {{date}}» — у обоих участников */
        duoWith: string;
        /** Покупателю, приглашение письмом ушло, второй ещё не принял */
        duoInviteSent: string;
        /** Покупателю, приглашение ещё не отправлял */
        duoInvite: string;
        duoInviteLink: string;
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
        const status = membershipStatusText(regular, date(regular.endDate), labels);
        return (
            <div className="flex w-full max-w-[240px] flex-col items-center gap-4 rounded-xl bg-[#F5F5F5] px-5 py-4">
                <p className="text-center text-[14px] text-ink-secondary" data-testid="membership-status">{status.text}</p>
                {status.invite && <a href={`${membershipHref}#duo`} className="-mt-2 text-center text-[14px] text-primary hover:underline">{labels.duoInviteLink}</a>}
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
