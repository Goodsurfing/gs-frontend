"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

const button = "flex items-center justify-center rounded-[10px] border border-primary px-[50px] py-2.5 text-center text-[16px] leading-[120%] transition-all duration-300";

/**
 * «Поддержать» и «Редактировать» на странице сбора (HeaderDonationCard и
 * DonationSubmenu старого фронта). Гость — на вход с возвратом к сбору;
 * вошёл без роли волонтёра — на выбор роли; волонтёр — к оплате, если сбор
 * принимает пожертвования. Страница общая, поэтому права вошедшего
 * дозапрашиваются в браузере.
 */
export function FundraiseActions({ fundraiseId, variant, hrefs, labels }: {
    fundraiseId: string;
    /** hero — в карточке, menu — в меню разделов */
    variant: "hero" | "menu";
    hrefs: { signIn: string; profileRole: string; pay: string; edit: string };
    labels: { support: string; becomeVolunteer: string; edit: string };
}) {
    const session = useSession();
    const [rights, setRights] = useState({ canSupport: false, canEdit: false });

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        browserApi(session.token).GET("/api/v1/fundraise/{id}", { params: { path: { id: fundraiseId } } })
            .then(({ data }) => {
                if (!cancelled && data) setRights({ canSupport: data.isCanSupport, canEdit: data.isCanEdit });
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, fundraiseId]);

    const signedIn = session.status === "user";
    const needVolunteerRole = signedIn && !session.profile?.volunteer;
    const disabled = signedIn && !needVolunteerRole && !rights.canSupport;
    let href = `${hrefs.signIn}?next=donation&nextId=${fundraiseId}`;
    if (needVolunteerRole) href = `${hrefs.profileRole}?nextDonation=${fundraiseId}`;
    else if (signedIn) href = hrefs.pay;
    const text = needVolunteerRole ? labels.becomeVolunteer : labels.support;

    return (
        <>
            {disabled
                ? <span aria-disabled className={`${button} bg-primary text-white opacity-70`}>{text}</span>
                : <a href={href} className={`${button} bg-primary text-white hover:bg-white hover:text-primary`}>{text}</a>}
            {rights.canEdit && (
                <a
                    href={hrefs.edit}
                    className={variant === "hero"
                        ? `${button} bg-primary text-white hover:bg-white hover:text-primary`
                        : `${button} w-full max-w-[150px] text-primary hover:bg-primary hover:text-white`}
                >
                    {labels.edit}
                </a>
            )}
        </>
    );
}
