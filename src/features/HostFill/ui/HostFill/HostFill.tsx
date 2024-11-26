import { memo } from "react";
import cn from "classnames";

import { useUser } from "@/entities/Profile";

import styles from "./HostFill.module.scss";
import { HostFillTitle } from "../HostFillTitle/HostFillTitle";
import { StatsChartPoints, StatsPoints } from "@/entities/Stats";
import { FillDiagram } from "@/shared/ui/FillDiagram/FillDiagram";
import { EditHost } from "../EditHost/EditHost";
import { CreateHost } from "../CreateHost/CreateHost";
import { useGetMyHostQuery } from "@/entities/Host/api/hostApi";

interface HostFillProps {
    className?: string;
}

export const HostFill = memo((props: HostFillProps) => {
    const { className } = props;
    const { data: getHost } = useGetMyHostQuery();
    const { profile, isLoading, error } = useUser();
    const host = profile?.host;

    const isDescirption = !!getHost?.name;
    const isGallery = !!(getHost?.galleryImages && getHost?.galleryImages.length !== 0);
    const isVideoGallery = !!(getHost?.videoGallery && getHost?.videoGallery.length !== 0);
    const isOffers = !!(getHost?.vacancies && getHost?.vacancies.length !== 0);

    if (isLoading) {
        return (
            <div className={cn(styles.wrapper, className)}>
                Загрузка...
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn(styles.wrapper, className)}>
                Ошибка
            </div>
        );
    }

    // todo no backend here
    const pointsData: StatsChartPoints[] = [{
        text: "Описание",
        completed: isDescirption,
    }, {
        text: "Фотографии",
        completed: isGallery,
    }, {
        text: "Видео",
        completed: isVideoGallery,
    }, {
        text: "Предложения",
        completed: isOffers,
    }, {
        text: "Отзывы",
        completed: false,
    }];

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <HostFillTitle isLoading={isLoading} text={getHost?.name} />
            </div>
            <div className={styles.bottom}>
                <div className={styles.leftSide}>
                    <StatsPoints
                        isLoading={isLoading}
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
                        isLoading={isLoading}
                        pointsData={pointsData}
                    />
                </div>
            </div>
        </div>
    );
});
