import React, { FC, useCallback } from "react";

import { useTranslation } from "react-i18next";
import { OfferCard } from "@/entities/Offer";

import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";

import { TermsApplication } from "../TermsApplication/TermsApplication";
import styles from "./OfferApplication.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useCategories } from "@/shared/data/categories";
import { FormApplicationOffer, FormApplicationStatus } from "@/entities/Application";

type OfferApplcation = Omit<FormApplicationOffer, "applicationEndDate" | "categories"> & {
    categoryName: string;
};

interface OfferApplicationProps {
    offerData: OfferApplcation;
    isHost: boolean;
    username: string;
    isClosed?: boolean;
    onSubmit?: () => void;
    terms: DatesType;
    onChange: (terms: DatesType) => void;
    onApplicationSubmit?: (value: FormApplicationStatus) => void;
}

interface DatesType {
    start: Date | undefined;
    end: Date | undefined;
}

export const OfferApplication: FC<OfferApplicationProps> = (props) => {
    const {
        isHost, username, isClosed, onSubmit, terms, onChange, offerData,
        onApplicationSubmit,
    } = props;
    const {
        id, acceptedApplicationsCount,
        reviewsCount, averageRating, categoryName, shortDescription,
        title, address,
    } = offerData;
    const { locale } = useLocale();
    const { getTranslation } = useCategories();
    const { t } = useTranslation("messenger");

    const handleDates = useCallback(
        (periods: DatesType) => {
            onChange({
                ...terms,
                start: periods.start,
                end: periods.end,
            });
        },
        [onChange, terms],
    );

    const renderTitle = () => {
        if (isClosed) {
            return (
                <span className={styles.line}>
                    {username}
                    {" "}
                    {t("подал заявку на вакансию")}
                </span>
            );
        }
        return (
            <span className={styles.line}>
                {t("Вы подали заявку на данную вакансию")}
            </span>
        );
    };

    return (
        <div className={styles.wrapper}>
            {renderTitle()}
            <OfferCard
                isFavoriteIconShow={false}
                handleFavoriteClick={() => {}}
                locale={locale}
                isFavorite={false}
                offerId={id}
                category={getTranslation(categoryName)}
                description={shortDescription}
                location={address}
                rating={Number(averageRating?.toFixed(1))}
                reviews={reviewsCount}
                title={title}
                went={Number(acceptedApplicationsCount)}
                isImageShow={false}
                link={getOfferPersonalPageUrl(locale, id.toString())}
            />
            <TermsApplication
                locale={locale}
                terms={terms}
                onChange={handleDates}
                isSuccess={isClosed || false}
                isHost={isHost}
                onSubmit={onSubmit}
                onApplicationSubmit={onApplicationSubmit}
            />
        </div>
    );
};
