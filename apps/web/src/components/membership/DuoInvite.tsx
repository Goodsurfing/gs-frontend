"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { browserApi } from "@/lib/browserApi";

import { atomDate, type DuoLabels, fill } from "./duo";

interface Preview {
    valid: boolean;
    reason?: string | null;
    ownerFirstName?: string | null;
    endDate?: string | null;
}

const button = "inline-flex cursor-pointer items-center justify-center rounded-[10px] border border-cta bg-cta px-[50px] py-3 text-center text-[16px] leading-[120%] text-white no-underline transition-all duration-300 hover:bg-white hover:text-cta disabled:cursor-default disabled:opacity-60";

/** Отказ API → текст для человека */
const reasonText = (type: string | null | undefined, labels: DuoLabels): string => ({
    duo_invite_not_found: labels["invite-not-found"],
    duo_invite_expired: labels["invite-expired"],
    duo_seat_taken: labels["invite-taken"],
    duo_own_invite: labels["invite-own"],
    duo_has_host_membership: labels["invite-host"],
    duo_has_lifetime: labels["invite-lifetime"],
} as Record<string, string>)[type ?? ""] ?? labels["invite-error"];

/**
 * Страница приглашения: кто пригласил и до какого числа членство; гостю — войти
 * (после входа вернёт сюда), вошедшему — «Присоединиться». Что приглашение
 * недействительно, показываем сразу, без кнопки.
 */
export function DuoInvite({ token, signInHref, signUpHref, offersHref, labels }: {
    token: string;
    signInHref: string;
    signUpHref: string;
    offersHref: string;
    labels: DuoLabels;
}) {
    const session = useSession();
    const [preview, setPreview] = useState<Preview | null>(null);
    const [problem, setProblem] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [doneUntil, setDoneUntil] = useState<string | null>(null);

    useEffect(() => {
        browserApi().GET("/api/v1/membership/duo/invite/{token}", { params: { path: { token } } })
            .then(({ data, error, response }) => {
                if (data) setPreview(data as Preview);
                else setProblem(reasonText(response.status === 404 ? "duo_invite_not_found" : (error as { type?: string } | undefined)?.type, labels));
            })
            .catch(() => setProblem(labels["invite-error"]));
    }, [token, labels]);

    const accept = () => {
        if (session.status !== "user") return;
        setBusy(true);
        setProblem(null);
        browserApi(session.token).POST("/api/v1/membership/duo/invite/{token}/accept", { params: { path: { token } } })
            .then(({ data, error }) => {
                if (data) setDoneUntil(atomDate((data as { endDate?: string | null }).endDate));
                else setProblem(reasonText((error as { type?: string } | undefined)?.type, labels));
            })
            .catch(() => setProblem(labels["invite-error"]))
            .finally(() => setBusy(false));
    };

    if (!preview && !problem) return <Loading />;

    const name = preview?.ownerFirstName || "";
    return (
        <div className="mx-auto flex min-h-[50vh] max-w-[640px] flex-col items-center justify-center px-5 py-12 text-center">
            {preview && <h1 className="mb-4 text-[1.75rem] leading-[1.3] font-bold text-[#1a1a1a] down-sm:text-[1.375rem]">{fill(labels["invite-title"], { name })}</h1>}
            {doneUntil !== null ? (
                <>
                    <p role="status" className="mb-6 text-[1.125rem] text-cta">{fill(labels["invite-done"], { date: doneUntil })}</p>
                    <a href={offersHref} className={button}>{labels["invite-to-offers"]}</a>
                </>
            ) : preview && preview.valid ? (
                <>
                    <p className="mb-2 text-[1.0625rem] leading-[1.6] text-[#424242]">{fill(labels["invite-text"], { date: atomDate(preview.endDate) })}</p>
                    <p className="mb-6 text-[0.9375rem] leading-[1.5] text-[#86909a]">{labels["invite-extend"]}</p>
                    {problem && <p role="alert" className="mb-4 text-error">{problem}</p>}
                    {session.status === "user" && <button type="button" className={button} disabled={busy} onClick={accept}>{labels["invite-accept"]}</button>}
                    {session.status === "guest" && (
                        <>
                            <a href={signInHref} className={button}>{labels["invite-sign-in"]}</a>
                            <p className="mt-4 text-[0.875rem] text-[#86909a]"><a href={signUpHref} className="underline">{labels["invite-sign-up"]}</a></p>
                        </>
                    )}
                    {session.status === "unknown" && <Loading />}
                </>
            ) : (
                <p role="alert" className="text-[1.0625rem] leading-[1.6] text-[#424242]">{problem ?? reasonText(preview?.reason, labels)}</p>
            )}
        </div>
    );
}
