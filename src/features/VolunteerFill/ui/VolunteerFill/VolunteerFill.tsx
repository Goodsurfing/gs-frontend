import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { StatsChartPoints, StatsPoints } from "@/entities/Stats";
import { useGetMyVolunteerQuery } from "@/entities/Volunteer";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { FillDiagram } from "@/shared/ui/FillDiagram/FillDiagram";

import { EditVolunteer } from "../EditVolunteer/EditVolunteer";
import styles from "./VolunteerFill.module.scss";

interface VolunteerFillProps {
    className?: string;
}

export const VolunteerFill = memo((props: VolunteerFillProps) => {
    const { className } = props;
    const { locale } = useLocale();
    const { t } = useTranslation("volunteer");

    const { data: myVolunteer } = useGetMyVolunteerQuery();

    const isSkills = !!(
        myVolunteer?.skills && myVolunteer?.skills.length !== 0
    );
    const isGallery = !!(
        myVolunteer?.profile.galleryImages
        && myVolunteer?.profile.galleryImages.length !== 0
    );
    const isVideoGallery = !!(
        myVolunteer?.profile.videoGallery
        && myVolunteer?.profile.videoGallery.length !== 0
    );

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
            completed: false,
        },
        {
            text: "Членство",
            completed: false,
        },
    ];

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <h3>{t("volunteer-dashboard.Заполненность профиля")}</h3>
                <Link to={getMainPageUrl(locale)} className={styles.toProfile}>
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
