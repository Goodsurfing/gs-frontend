import { ReactNode, memo } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";

import styles from "./HostFill.module.scss";
import { HostFillTitle } from "../HostFillTitle/HostFillTitle";
import { StatsChartPoints, StatsPoints } from "@/entities/Stats";
import { FillDiagram } from "@/shared/ui/FillDiagram/FillDiagram";
import { EditHost } from "../EditHost/EditHost";
import { CreateHost } from "../CreateHost/CreateHost";
import { useGetMyHostQuery } from "@/entities/Host/api/hostApi";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useGetOfferReviewsQuery } from "@/entities/Review";

interface HostFillProps {
    className?: string;
    /** GS-188: виджет рядом с диаграммой заполненности (счётчик лимита). */
    extra?: ReactNode;
}

export const HostFill = memo((props: HostFillProps) => {
    const { className, extra } = props;
    const { t } = useTranslation("host");
    const { data: getHost } = useGetMyHostQuery();
    const { myProfile, profileIsLoading, profileIsError } = useAuth();
    const { data: reviewsData } = useGetOfferReviewsQuery({ limit: 1, page: 1 });
    const host = myProfile?.hostId;

    const isDescirption = !!getHost?.name;
    const isGallery = !!(getHost?.galleryImages && getHost?.galleryImages.length !== 0);
    const isVideoGallery = !!(getHost?.videoGallery && getHost?.videoGallery.length !== 0);
    const isOffers = !!(getHost?.vacancies && getHost?.vacancies.length !== 0);
    const isReviews = !!(reviewsData && reviewsData.data.length !== 0);

    if (profileIsLoading) {
        return (
            <div className={cn(styles.wrapper, className)}>
                {t("Загрузка")}
            </div>
        );
    }

    if (profileIsError) {
        return (
            <div className={cn(styles.wrapper, className)}>
                {t("Ошибка")}
            </div>
        );
    }

    // todo no backend here
    const pointsData: StatsChartPoints[] = [
        {
            text: t("Описание"),
            completed: isDescirption,
        },
        {
            text: t("Вакансии"),
            completed: isOffers,
        },
        {
            text: t("Фото"),
            completed: isGallery,
        },
        {
            text: t("Видео"),
            completed: isVideoGallery,
        },
        {
            text: t("Отзывы"),
            completed: isReviews,
        }];

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <HostFillTitle isLoading={profileIsLoading} text={getHost?.name} />
            </div>
            <div className={styles.bottom}>
                <div className={styles.leftSide}>
                    <StatsPoints
                        isLoading={profileIsLoading}
                        pointsData={pointsData}
                    />
                    <div>
                        {host ? (
                            <EditHost className={styles.button} />
                        ) : (
                            <CreateHost className={styles.button} />
                        )}
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <FillDiagram
                        isLoading={profileIsLoading}
                        pointsData={pointsData}
                    />
                    {extra}
                </div>
            </div>
        </div>
    );
});
