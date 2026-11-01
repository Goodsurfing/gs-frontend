import cn from "classnames";
import { ReactNode, memo } from "react";
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
    /** GS-188: виджет рядом с диаграммой заполненности (счётчик лимита). */
    extra?: ReactNode;
}

export const VolunteerFill = memo((props: VolunteerFillProps) => {
    const { className, extra } = props;
    const { locale } = useLocale();
    const { t } = useTranslation("volunteer");

    const { data: myVolunteer } = useGetMyVolunteerQuery();
    const { data: profileOccupancy } = useGetProfileOccupancyQuery();

    const isSkills = profileOccupancy ? profileOccupancy.isSkill : false;
    const isGallery = profileOccupancy ? profileOccupancy.isPhoto : false;
    const isVideoGallery = profileOccupancy ? profileOccupancy.isVideo : false;
    const isBlog = profileOccupancy ? profileOccupancy.isBlogPost : false;
    const isMembership = profileOccupancy ? profileOccupancy.isMembership : false;

    // Имя и рассказ о себе тоже часть профиля: без этого пункта заполненный
    // профиль без фото и навыков показывал 0% (аудит 29.10)
    const profile = myVolunteer?.profile;
    const isAbout = Boolean(profile?.firstName?.trim() && profile?.aboutMe?.trim());

    const pointsData: StatsChartPoints[] = [
        {
            text: "О себе",
            completed: isAbout,
        },
        {
            text: "Навыки",
            completed: isSkills,
        },
        {
            text: "Фото",
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
                    {extra}
                </div>
            </div>
        </div>
    );
});
