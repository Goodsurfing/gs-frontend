import React, { FC, useCallback } from "react";

import { Offer, OfferCard } from "@/entities/Offer";

import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";

import { TermsApplication } from "../TermsApplication/TermsApplication";
import styles from "./OfferApplication.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

interface OfferApplicationProps {
    offerData: Offer;
    isHost: boolean;
    username: string;
    isClosed?: boolean;
    onSubmit?: () => void;
    terms: DatesType;
    onChange: (terms: DatesType) => void;
}

interface DatesType {
    start: Date | undefined;
    end: Date | undefined;
}

export const OfferApplication: FC<OfferApplicationProps> = (props) => {
    const {
        isHost, username, isClosed, onSubmit, terms, onChange, offerData,
    } = props;
    const { description, where, id } = offerData;
    const { locale } = useLocale();

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
        if (isHost) {
            return (
                <span className={styles.line}>
                    {username}
                    {" "}
                    подал заявку на вашу вакансию
                </span>
            );
        }
        return (
            <span className={styles.line}>
                Вы подали заявку на данную вакансию
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
                category={description?.categoryIds[0]}
                description={description?.shortDescription}
                likes="5"
                location={where?.address}
                rating="4"
                reviews="15"
                title={description?.title}
                went="8"
                isImageShow={false}
                link={getOfferPersonalPageUrl(locale, id.toString())}
            />
            <TermsApplication
                terms={terms}
                onChange={handleDates}
                isSuccess={isClosed || false}
                isHost={isHost}
                onSubmit={onSubmit}
            />
        </div>
    );
};
