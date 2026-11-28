"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

import { reachGoal } from "@/components/analytics/YandexMetrika";
import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

/** Что вошедший может сделать с вакансией — API считает это для каждого своё. */
export interface OfferViewerState {
    signedIn: boolean;
    /** Вошёл (или вход ещё проверяется), а ответ API для него ещё не пришёл */
    loading: boolean;
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
    loading: false,
    needVolunteerRole: false,
    canEdit: false,
    canParticipate: false,
    canReview: false,
    textParticipate: null,
    requiresMembership: false,
    profileId: null,
};

const LOADING: OfferViewerState = { ...GUEST, loading: true };

const OfferViewerContext = createContext<OfferViewerState>(GUEST);

/**
 * Страница вакансии одинакова для всех (кэшируется); после входа браузер
 * ещё раз спрашивает вакансию от имени пользователя и узнаёт, можно ли
 * откликнуться, редактировать и оставить отзыв.
 */
export function OfferViewerProvider({ offerId, children }: { offerId: number; children: ReactNode }) {
    const session = useSession();
    const [state, setState] = useState<OfferViewerState>(GUEST);

    // Просмотр вакансии — для всех, включая гостей (OfferPersonalPage старого фронта)
    useEffect(() => {
        reachGoal("vacancy_view", { vacancyId: String(offerId) });
    }, [offerId]);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token)
            .GET("/api/v1/vacancy/{id}", { params: { path: { id: offerId } } })
            .then(({ data }) => {
                if (cancelled || !data) return;
                setState({
                    signedIn: true,
                    loading: false,
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
            // Не ответил API — кнопка как у гостя, сервер всё равно проверит заявку
            .catch(() => {
                if (!cancelled) setState({ ...GUEST, signedIn: true, needVolunteerRole: !session.profile?.volunteer, profileId: session.profile?.id ?? null, token: session.token });
            });
        return () => {
            cancelled = true;
        };
    }, [offerId, session.status, session.profile, session.token]);

    // Гость и пока вход не проверен — состояние гостя (страница из кэша сразу с рабочей кнопкой, это
    // важно на медленном интернете). Вошёл, но ответ API для него ещё не пришёл — «загрузка»: кнопка
    // не показывается активной, чтобы потом не погаснуть (сообщение тестировщика 27.11.2026)
    const value = session.status !== "user" ? GUEST : state.signedIn ? state : LOADING;
    return <OfferViewerContext.Provider value={value}>{children}</OfferViewerContext.Provider>;
}

export const useOfferViewer = () => useContext(OfferViewerContext);
