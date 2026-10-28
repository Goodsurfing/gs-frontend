import { useCallback, useMemo } from "react";

import { getUserAuthData } from "@/entities/User";
import { useAppSelector } from "@/shared/hooks/redux";

import {
    useAddFavoriteOfferMutation,
    useGetFavoriteOfferIdsQuery,
    useRemoveFavoriteOfferMutation,
} from "../api/offerApi";

/**
 * Избранные вакансии текущего пользователя: отмечено ли сердечко и
 * переключение. Гостю — enabled: false, запросов нет. Список id один на
 * всё приложение (кэш RTK Query), сколько бы карточек его ни спрашивали.
 */
export const useFavoriteOffers = () => {
    const isAuth = Boolean(useAppSelector(getUserAuthData));
    const { data } = useGetFavoriteOfferIdsQuery(undefined, { skip: !isAuth });
    const [add] = useAddFavoriteOfferMutation();
    const [remove] = useRemoveFavoriteOfferMutation();

    const ids = useMemo(() => new Set(data?.ids ?? []), [data]);

    const isFavorite = useCallback((offerId: number) => ids.has(offerId), [ids]);

    const toggleFavorite = useCallback((offerId: number) => {
        if (ids.has(offerId)) {
            remove(offerId);
        } else {
            add(offerId);
        }
    }, [ids, add, remove]);

    return { enabled: isAuth, isFavorite, toggleFavorite };
};
