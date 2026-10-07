import {
    FC, memo, useEffect, useRef, useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useGetProfileOccupancyQuery } from "@/entities/Profile";
import { getUserAuthData } from "@/entities/User";
import { useAppSelector } from "@/shared/hooks/redux";
import { Modal } from "@/shared/ui/Modal/Modal";
import { MemberBanner } from "@/features/MemberBanner";

/** Документ-источник отмечает диапазон "1-3 минуты" и сам помечает это как
 * опциональное — середина диапазона выбрана как разумный дефолт. */
const POPUP_DELAY_MS = 2 * 60 * 1000;
const SESSION_STORAGE_KEY = "membershipTimedPopupShown";

/**
 * GS-174: опциональный попап с предложением членства для пользователей
 * без него — один раз за сессию (sessionStorage, переживает перезагрузку
 * страницы в той же вкладке, но не новую вкладку/сессию), через
 * POPUP_DELAY_MS после монтирования (один раз на всё приложение — монтируется
 * в App.tsx, не на отдельной странице).
 *
 * Таймер планируется только один раз за время жизни компонента (hasScheduledRef) —
 * без этого эффект пересоздавал бы setTimeout при каждом обновлении
 * profileOccupancy (RTK Query меняет ссылку на объект при рефетче), и
 * cleanup от предыдущего запуска отменял бы ещё не сработавший таймер.
 */
export const MembershipTimedPopup: FC = memo(() => {
    const isAuth = useAppSelector(getUserAuthData);
    const { data: profileOccupancy } = useGetProfileOccupancyQuery(undefined, { skip: !isAuth });
    const { t } = useTranslation("host");
    const [isOpen, setIsOpen] = useState(false);
    const hasScheduledRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (hasScheduledRef.current) return;
        if (!isAuth || !profileOccupancy || profileOccupancy.isMembership) return;
        if (sessionStorage.getItem(SESSION_STORAGE_KEY)) return;

        hasScheduledRef.current = true;
        sessionStorage.setItem(SESSION_STORAGE_KEY, "1");
        timerRef.current = setTimeout(() => setIsOpen(true), POPUP_DELAY_MS);
    }, [isAuth, profileOccupancy]);

    useEffect(() => () => {
        clearTimeout(timerRef.current);
    }, []);

    if (!isOpen || !profileOccupancy) {
        return null;
    }

    const isHostWithoutMembership = profileOccupancy.remainingFreeVacancies !== null;

    return (
        <Modal onClose={() => setIsOpen(false)}>
            {isHostWithoutMembership ? (
                <MemberBanner
                    title={t("host-dashboard.Зарегистрируй членство организатора и получи больше возможностей для своего проекта!")}
                    anchor="host"
                />
            ) : (
                <MemberBanner />
            )}
        </Modal>
    );
});
