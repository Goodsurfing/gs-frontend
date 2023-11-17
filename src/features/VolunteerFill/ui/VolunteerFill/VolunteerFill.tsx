import cn from "classnames";
import { memo } from "react";

import { StatsPoints } from "@/entities/Stats";

import { FillDiagram } from "@/shared/ui/FillDiagram/FillDiagram";

import { pointsData } from "../../model/data/pointsData";
import { EditVolunteer } from "../EditVolunteer/EditVolunteer";
import styles from "./VolunteerFill.module.scss";

interface VolunteerFillProps {
    className?: string;
}

export const VolunteerFill = memo((props: VolunteerFillProps) => {
    const { className } = props;

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <h3>Заполненность профиля</h3>
            </div>
            <div className={styles.bottom}>
                <div className={styles.leftSide}>
                    <StatsPoints pointsData={pointsData} />
                    <div>
                        <EditVolunteer />
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <FillDiagram pointsData={pointsData} />
                </div>
            </div>
        </div>
    );
});
