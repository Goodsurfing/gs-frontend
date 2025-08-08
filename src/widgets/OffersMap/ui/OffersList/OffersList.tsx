import cn from "classnames";
import React, {
    FC, useCallback, useMemo,
} from "react";

import { useTranslation } from "react-i18next";
import { Text } from "@/shared/ui/Text/Text";

import { HeaderList } from "../HeaderList/HeaderList";
import { OfferCard } from "../OfferCard/OfferCard";
import { OfferPagination } from "../OfferPagination/OfferPagination";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Offer } from "@/entities/Offer";
import styles from "./OffersList.module.scss";

interface OffersListProps {
    className?: string;
    mapOpenValue: boolean;
    onChangeMapOpen: () => void;
    data?: Offer[];
    isLoading: boolean;
    currentPage: number;
    offersPerPage: number;
    onChangePage: (pageItem: number) => void;
}

export const OffersList: FC<OffersListProps> = (props: OffersListProps) => {
    const {
        mapOpenValue, onChangeMapOpen, data, className,
        currentPage, offersPerPage,
        onChangePage, isLoading,
    } = props;

    const { locale } = useLocale();
    const { t } = useTranslation("offers-map");

    const currentOffers = useMemo(() => {
        const startIndex = (currentPage - 1) * offersPerPage;
        const endIndex = startIndex + offersPerPage;
        return data?.slice(startIndex, endIndex);
    }, [currentPage, offersPerPage, data]);

    const changeMapOpen = useCallback(() => {
        onChangeMapOpen();
    }, [onChangeMapOpen]);

    const changeCurrentPage = useCallback((page: number) => {
        onChangePage(page);
    }, [onChangePage]);

    const renderOfferCards = useMemo(
        () => {
            if (isLoading) {
                return (<MiniLoader className={styles.miniLoader} />);
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
                return currentOffers?.map((offer) => (
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
        },
        [currentOffers, data, isLoading, locale, mapOpenValue, t],
    );

    const totalPages = data ? Math.ceil(data.length / offersPerPage) : 0;

    return (
        <div className={cn(styles.wrapper, className)}>
            <HeaderList
                offersLength={data ? data.length : 0}
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
            />
        </div>
    );
};
