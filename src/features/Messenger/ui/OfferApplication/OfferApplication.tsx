import React, { FC } from "react";

import { OfferCard } from "@/entities/Offer";

import styles from "./OfferApplication.module.scss";

interface OfferApplicationProps {
    onChange?: () => void;
    isHost: boolean;
    username: string;
}

export const OfferApplication: FC<OfferApplicationProps> = (props) => {
    const { onChange, isHost, username } = props;

    return (
        <div className={styles.wrapper}>
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
        </div>
    );
};
