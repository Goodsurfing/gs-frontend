import React, { FC, useCallback, useState } from "react";

import { OfferCard } from "@/entities/Offer";

import { TermsApplication } from "../TermsApplication/TermsApplication";
import styles from "./OfferApplication.module.scss";

interface OfferApplicationProps {
    isHost: boolean;
    username: string;
}

interface DatesType {
    start: Date | undefined;
    end: Date | undefined;
}

export const OfferApplication: FC<OfferApplicationProps> = (props) => {
    const { isHost, username } = props;
    const [whenPeriods, setWhenPeriods] = useState<DatesType>({
        start: undefined,
        end: undefined,
    });

    const handleDates = useCallback(
        (periods: DatesType) => {
            setWhenPeriods({
                ...whenPeriods,
                start: periods.start,
                end: periods.end,
            });
        },
        [whenPeriods],
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
                terms={whenPeriods}
                onChange={handleDates}
                isSuccess={false}
                isHost={isHost}
            />
        </div>
    );
};
