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
        completed: true,
    }, {
        text: "Фотографии",
        completed: true,
    }, {
        text: "Видео",
        completed: true,
    }, {
        text: "Предложения",
        completed: true,
    }, {
        text: "Отзывы",
        completed: true,
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
                            <EditHost />
                        ) : (
                            <CreateHost />
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
