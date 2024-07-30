import React, { FC, useCallback } from "react";

import { OfferCard } from "@/entities/Offer";

import { TermsApplication } from "../TermsApplication/TermsApplication";
import styles from "./OfferApplication.module.scss";

interface OfferApplicationProps {
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
        isHost, username, isClosed, onSubmit, terms, onChange,
    } = props;

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
                category="category"
                description="description"
                likes="5"
                location="Казань"
                rating="4"
                reviews="15"
                title="Тестовая вакансия"
                went="8"
                isImageShow={false}
                link="offer-personal/1"
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
