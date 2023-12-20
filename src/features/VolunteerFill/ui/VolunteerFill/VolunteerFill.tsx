import cn from "classnames";
import { memo } from "react";

import { Link } from "react-router-dom";
import { StatsPoints } from "@/entities/Stats";

import { FillDiagram } from "@/shared/ui/FillDiagram/FillDiagram";

import { pointsData } from "../../model/data/pointsData";
import { EditVolunteer } from "../EditVolunteer/EditVolunteer";
import styles from "./VolunteerFill.module.scss";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface VolunteerFillProps {
    className?: string;
}

export const VolunteerFill = memo((props: VolunteerFillProps) => {
    const { className } = props;
    const { locale } = useLocale();

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <h3>Заполненность профиля</h3>
                <Link
                    to={getMainPageUrl(locale)}
                    className={styles.toProfile}
                >
                    Посмотреть свой профиль
                </Link>
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
