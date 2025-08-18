import cn from "classnames";
import React, {
    FC, useCallback, useMemo, useRef, useTransition,
} from "react";
import { useTranslation } from "react-i18next";
import AutoSizer from "react-virtualized-auto-sizer";
import {
    VariableSizeList as List,
    ListChildComponentProps,
} from "react-window";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Offer } from "@/entities/Offer";

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Text } from "@/shared/ui/Text/Text";

import { HeaderList } from "../HeaderList/HeaderList";
import { MeasuredOfferCard } from "../MeasureOfferCard/MeasureOfferCard";
import { OfferPagination } from "../OfferPagination/OfferPagination";
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
        mapOpenValue,
        onChangeMapOpen,
        data,
        className,
        currentPage,
        offersPerPage,
        onChangePage,
        isLoading,
    } = props;

    const { locale } = useLocale();
    const { t } = useTranslation("offers-map");
    const [isPending, startTransition] = useTransition();
    const listRef = useRef<List>(null);
    const sizeMap = useRef<{ [index: number]: number }>({});

    const currentOffers = useMemo(() => {
        const startIndex = (currentPage - 1) * offersPerPage;
        const endIndex = startIndex + offersPerPage;
        return data?.slice(startIndex, endIndex) || [];
    }, [currentPage, offersPerPage, data]);

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

    const getSize = (index: number) => sizeMap.current[index] || 200;
    const setSize = (index: number, size: number) => {
        if (sizeMap.current[index] !== size) {
            sizeMap.current[index] = size;
            listRef.current?.resetAfterIndex(index);
        }
    };

    const Row = ({ index, style }: ListChildComponentProps) => {
        const offer = data[index];
        return (
            <div style={style}>
                <MeasuredOfferCard
                    offer={offer}
                    locale={locale}
                    mapOpenValue={mapOpenValue}
                    setSize={(h) => setSize(index, h)}
                />
            </div>
        );
    };

    // TODO: Переписать и убрать этот react window, он мне не нравится :/
    // нужно бека попросить сделать динамический фетч изображений

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
                {isLoading || isPending ? (
                    <MiniLoader className={styles.miniLoader} />
                ) : data && data.length === 0 ? (
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text={t("Вакансии не были найдены")}
                    />
                ) : (
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                ref={listRef}
                                itemSize={getSize}
                                className={styles.listContainer}
                                height={height}
                                itemCount={currentOffers.length}
                                estimatedItemSize={200}
                                width={width}
                            >
                                {Row}
                            </List>
                        )}
                    </AutoSizer>
                )}
            </div>
            <OfferPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={changeCurrentPage}
            />
        </div>
    );
};
