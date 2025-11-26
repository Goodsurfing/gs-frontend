import cn from "classnames";
import React, {
    FC, useCallback, useMemo, useTransition,
} from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { OfferApi } from "@/entities/Offer";

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Text } from "@/shared/ui/Text/Text";

import { HeaderList } from "../HeaderList/HeaderList";
import { OfferCard } from "../OfferCard/OfferCard";
import { OfferPagination } from "../OfferPagination/OfferPagination";
import styles from "./OffersList.module.scss";

interface OffersListProps {
    className?: string;
    mapOpenValue: boolean;
    onChangeMapOpen: () => void;
    data?: OfferApi[];
    isLoading: boolean;
    currentPage: number;
    offersPerPage: number;
    total: number;
    onChangePage: (pageItem: number) => void;
}

export const OffersList: FC<OffersListProps> = (props: OffersListProps) => {
    const {
        mapOpenValue,
        onChangeMapOpen,
        data,
        className,
        currentPage,
        offersPerPage,
        total,
        onChangePage,
        isLoading,
    } = props;

    const { locale } = useLocale();
    const { t } = useTranslation("offers-map");
    const [isPending, startTransition] = useTransition();

    const changeMapOpen = useCallback(() => {
        onChangeMapOpen();
    }, [onChangeMapOpen]);

    const changeCurrentPage = useCallback(
        (page: number) => {
            startTransition(() => {
                onChangePage(page);
            });
        },
        [onChangePage],
    );

    const renderOfferCards = useMemo(() => {
        if (isLoading || isPending) {
            return <MiniLoader className={styles.miniLoader} />;
        }
        if (data) {
            if (data.length === 0) {
                return (
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text={t("Вакансии не были найдены")}
                    />
                );
            }
            return data.map((offer) => (
                <OfferCard
                    locale={locale}
                    classNameCard={styles.offerCard}
                    className={cn(styles.offer, {
                        [styles.closed]: !mapOpenValue,
                    })}
                    status={offer.status === "active" ? "opened" : "closed"}
                    data={offer}
                    key={offer.id}
                    // isFavoriteIconShow={!!isAuth}
                />
            ));
        }
        return (
            <Text
                className={styles.error}
                textSize="primary"
                text={t("Вакансии не были найдены")}
            />
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isLoading, locale, mapOpenValue, t]);

    const totalPages = Math.ceil(total / offersPerPage);

    return (
        <div className={cn(styles.wrapper, className)}>
            <HeaderList
                offersLength={total}
                isShowMap={mapOpenValue}
                onChangeShowMap={changeMapOpen}
            />

            <div
                className={cn(styles.list, { [styles.closed]: !mapOpenValue })}
            >
                {renderOfferCards}
            </div>
            <OfferPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={changeCurrentPage}
                className={styles.pagination}
            />
        </div>
    );
};
