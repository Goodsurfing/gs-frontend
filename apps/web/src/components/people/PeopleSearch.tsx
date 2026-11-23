"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { browserApi } from "@/lib/browserApi";

interface Person { id: string; firstName: string; lastName: string; city: string | null; avatar: string | null }

export interface PeopleSearchLabels {
    label: string;
    placeholder: string;
    hint: string;
    empty: string;
    error: string;
    guest: string;
    signIn: string;
    privacy: string;
}

/** Ждём, пока человек допечатает: на медленном интернете не шлём запрос на каждую букву */
const DEBOUNCE_MS = 400;

/**
 * Поиск участников по имени (08.11.2026, вариант «Б»): только для вошедших; в выдаче —
 * волонтёры, которые не скрыли себя в «Приватности». До 20 человек за раз, ссылка — на профиль.
 */
export function PeopleSearch({ profileTemplate, signInHref, privacyHref, labels }: {
    /** Адрес профиля волонтёра с {id} */
    profileTemplate: string;
    signInHref: string;
    privacyHref: string;
    labels: PeopleSearchLabels;
}) {
    const session = useSession();
    const [query, setQuery] = useState("");
    const [state, setState] = useState<{ q: string; people: Person[] | null; failed: boolean } | null>(null);
    const trimmed = query.trim();

    useEffect(() => {
        if (session.status !== "user" || trimmed.length < 2) return;
        let cancelled = false;
        const timer = window.setTimeout(() => {
            void browserApi(session.token).GET("/api/v1/people/search", { params: { query: { q: trimmed } } })
                .then(({ data, error }) => {
                    if (cancelled) return;
                    setState({ q: trimmed, people: error ? null : ((data ?? []) as Person[]), failed: !!error });
                })
                .catch(() => !cancelled && setState({ q: trimmed, people: null, failed: true }));
        }, DEBOUNCE_MS);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [trimmed, session.status, session.token]);

    if (session.status === "unknown") return <Spinner />;
    if (session.status === "guest") {
        return (
            <p className="rounded-[10px] bg-field p-5 text-ink-secondary">
                {labels.guest} <a href={signInHref} className="font-semibold text-primary underline">{labels.signIn}</a>
            </p>
        );
    }

    const loading = trimmed.length >= 2 && state?.q !== trimmed;
    return (
        <div className="flex flex-col gap-5">
            <label className="flex max-w-[520px] flex-col gap-1.5 text-[15px] text-ink-secondary">
                {labels.label}
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={labels.placeholder}
                    maxLength={60}
                    autoComplete="off"
                    className="rounded-[10px] border border-[#e0e0e0] px-4 py-3 text-[16px] text-ink outline-none focus:border-primary"
                />
            </label>
            {trimmed.length < 2 ? (
                <p className="text-[14px] text-caption">{labels.hint}</p>
            ) : loading ? (
                <div className="flex py-4"><Spinner /></div>
            ) : state?.failed ? (
                <p role="alert" className="text-error">{labels.error}</p>
            ) : state?.people?.length === 0 ? (
                <p className="text-ink-secondary">{labels.empty}</p>
            ) : (
                <ul className="grid grid-cols-2 gap-3 down-sm:grid-cols-1" aria-live="polite">
                    {state?.people?.map((person) => (
                        <li key={person.id}>
                            <a href={profileTemplate.replace("{id}", person.id)} className="flex items-center gap-3 rounded-[12px] border border-accent-bg bg-white p-3 text-inherit no-underline transition-colors hover:border-primary">
                                <Avatar src={person.avatar ?? undefined} name={`${person.firstName} ${person.lastName}`} size={48} />
                                <span className="flex min-w-0 flex-col">
                                    <span className="truncate font-semibold text-ink">{`${person.firstName} ${person.lastName}`.trim()}</span>
                                    {person.city && <span className="truncate text-[13px] text-caption">{person.city}</span>}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
            <p className="text-[13px] text-caption"><a href={privacyHref} className="underline">{labels.privacy}</a></p>
        </div>
    );
}
