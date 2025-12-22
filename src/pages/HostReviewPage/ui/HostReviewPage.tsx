import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { ReviewAboutVolunteers } from "@/widgets/HostReview/";
import { Title } from "./Title/Title";

import { useGetMyHostQuery } from "@/entities/Host";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./HostReviewPage.module.scss";

const HostReviewPage: FC = () => {
    const { data: hostData, isLoading } = useGetMyHostQuery();
    const { locale } = useLocale();
    const { ready } = useTranslation("host");

    if (!hostData || isLoading || !ready) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <Title rating={hostData.averageRating} />
            <div className={styles.container}>
                <ReviewAboutVolunteers id={hostData.id} locale={locale} />
                {/* <ReviewAboutOffers hostId={hostData.id} locale={locale} /> */}
            </div>
        </div>
    );
};

export default HostReviewPage;
