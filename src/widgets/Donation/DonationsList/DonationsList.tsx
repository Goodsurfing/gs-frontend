import cn from "classnames";
import React, {
    FC, useCallback, useMemo, useTransition,
} from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Text } from "@/shared/ui/Text/Text";

import { OfferPagination } from "@/widgets/OffersMap";
import { DonationCard, donationCardAdapter, GetDonations } from "@/entities/Donation";
import { HeaderList } from "../HeaderList/HeaderList";
import styles from "./DonationsList.module.scss";

interface DonationsListProps {
    className?: string;
    mapOpenValue: boolean;
    onChangeMapOpen: () => void;
    data?: GetDonations[];
    isLoading: boolean;
    currentPage: number;
    donationsPerPage: number;
    total: number;
    onChangePage: (pageItem: number) => void;
}

export const DonationsList: FC<DonationsListProps> = (props: DonationsListProps) => {
    const {
        mapOpenValue,
        onChangeMapOpen,
        data,
        className,
        currentPage,
        donationsPerPage,
        total,
        onChangePage,
        isLoading,
    } = props;

    const { locale } = useLocale();
    const { t } = useTranslation("donation");
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

    const renderDonationsCards = useMemo(() => {
        if (isLoading || isPending) {
            return <MiniLoader className={styles.miniLoader} />;
        }
        if (data) {
            if (data.length === 0) {
                return (
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text={t("Сборы не были найдены")}
                    />
                );
            }
            return data.map((donation) => (
                <DonationCard
                    locale={locale}
                    className={styles.donationCard}
                    data={donationCardAdapter(donation)}
                    key={donation.id}
                />
            ));
        }
        return (
            <Text
                className={styles.error}
                textSize="primary"
                text={t("Сборы не были найдены")}
            />
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isLoading, locale, mapOpenValue, t]);

    const totalPages = Math.ceil(total / donationsPerPage);

    return (
        <div className={cn(styles.wrapper, className)}>
            <HeaderList
                donationsLength={total}
                isShowMap={mapOpenValue}
                onChangeShowMap={changeMapOpen}
            />
            <div
                className={cn(styles.list, { [styles.closed]: !mapOpenValue })}
            >
                {renderDonationsCards}
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
