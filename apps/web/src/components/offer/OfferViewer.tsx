"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

/** Что вошедший может сделать с вакансией — API считает это для каждого своё. */
export interface OfferViewerState {
    signedIn: boolean;
    /** Вошёл, но ещё не волонтёр — кнопка ведёт на выбор роли */
    needVolunteerRole: boolean;
    canEdit: boolean;
    canParticipate: boolean;
    canReview: boolean;
    textParticipate: string | null;
    requiresMembership: boolean;
    profileId: string | null;
    token?: string;
}

const GUEST: OfferViewerState = {
    signedIn: false,
    needVolunteerRole: false,
    canEdit: false,
    canParticipate: false,
    canReview: false,
    textParticipate: null,
    requiresMembership: false,
    profileId: null,
};

const OfferViewerContext = createContext<OfferViewerState>(GUEST);

/**
 * Страница вакансии одинакова для всех (кэшируется); после входа браузер
 * ещё раз спрашивает вакансию от имени пользователя и узнаёт, можно ли
 * откликнуться, редактировать и оставить отзыв.
 */
export function OfferViewerProvider({ offerId, children }: { offerId: number; children: ReactNode }) {
    const session = useSession();
    const [state, setState] = useState<OfferViewerState>(GUEST);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token)
            .GET("/api/v1/vacancy/{id}", { params: { path: { id: offerId } } })
            .then(({ data }) => {
                if (cancelled || !data) return;
                setState({
                    signedIn: true,
                    needVolunteerRole: !session.profile?.volunteer,
                    canEdit: data.canEdit,
                    canParticipate: data.canParticipate,
                    canReview: data.canReview,
                    textParticipate: data.textParticipate ?? null,
                    requiresMembership: data.requiresMembershipToParticipate,
                    profileId: session.profile?.id ?? null,
                    token: session.token,
                });
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [offerId, session.status, session.profile, session.token]);

    // Гость (или ещё не знаем) — состояние гостя
    const value = session.status === "user" ? state : GUEST;
    return <OfferViewerContext.Provider value={value}>{children}</OfferViewerContext.Provider>;
}

export const useOfferViewer = () => useContext(OfferViewerContext);
