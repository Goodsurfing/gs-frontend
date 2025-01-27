import React, { FC } from "react";
import { ReviewAboutVolunteers, ReviewAboutOffers } from "@/widgets/HostReview/";
import { Title } from "./Title/Title";

import styles from "./HostReviewPage.module.scss";
import { useGetMyHostQuery } from "@/entities/Host";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useLocale } from "@/app/providers/LocaleProvider";

const HostReviewPage: FC = () => {
    const { data: hostData, isLoading } = useGetMyHostQuery();
    const { locale } = useLocale();

    if (!hostData || isLoading) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <Title />
            <div className={styles.container}>
                <ReviewAboutVolunteers locale={locale} />
                <ReviewAboutOffers hostId={hostData.id} locale={locale} />
            </div>
        </div>
    );
};

export default HostReviewPage;
