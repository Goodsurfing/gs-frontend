import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { StatsChartPoints, StatsPoints } from "@/entities/Stats";
import { useGetMyVolunteerQuery } from "@/entities/Volunteer";

import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { FillDiagram } from "@/shared/ui/FillDiagram/FillDiagram";

import { EditVolunteer } from "../EditVolunteer/EditVolunteer";
import styles from "./VolunteerFill.module.scss";
import { useGetProfileOccupancyQuery } from "@/entities/Profile";

interface VolunteerFillProps {
    className?: string;
}

export const VolunteerFill = memo((props: VolunteerFillProps) => {
    const { className } = props;
    const { locale } = useLocale();
    const { t } = useTranslation("volunteer");

    const { data: myVolunteer } = useGetMyVolunteerQuery();
    const { data: profileOccupancy } = useGetProfileOccupancyQuery();

    const isSkills = profileOccupancy ? profileOccupancy.isSkill : false;
    const isGallery = profileOccupancy ? profileOccupancy.isPhoto : false;
    const isVideoGallery = profileOccupancy ? profileOccupancy.isVideo : false;
    const isBlog = profileOccupancy ? profileOccupancy.isBlogPost : false;
    const isMembership = profileOccupancy ? profileOccupancy.isMembership : false;

    const pointsData: StatsChartPoints[] = [
        {
            text: "Навыки",
            completed: isSkills,
        },
        {
            text: "Фотографии",
            completed: isGallery,
        },
        {
            text: "Видео",
            completed: isVideoGallery,
        },
        {
            text: "Публикации в блоге",
            completed: isBlog,
        },
        {
            text: "Членство",
            completed: isMembership,
        },
    ];

    if (!myVolunteer) {
        return null;
    }

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <h3>{t("volunteer-dashboard.Заполненность профиля")}</h3>
                <Link
                    to={getVolunteerPersonalPageUrl(locale, myVolunteer.profile.id)}
                    className={styles.toProfile}
                >
                    {t("volunteer-dashboard.Посмотреть свой профиль")}
                </Link>
            </div>
            <div className={styles.bottom}>
                <div className={styles.leftSide}>
                    <StatsPoints pointsData={pointsData} />
                    <div>
                        <EditVolunteer className={styles.edit} />
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <FillDiagram pointsData={pointsData} />
                </div>
            </div>
        </div>
    );
});
