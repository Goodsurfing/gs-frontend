import cn from "classnames";
import React, { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";

import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

import { Host } from "@/entities/Host";
import { VolunteerApi } from "@/entities/Volunteer";

import exitIcon from "@/shared/assets/icons/delete.svg";
import {
    getHostPersonalPageUrl,
    getVolunteerPersonalPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useFormatLanguages } from "@/shared/data/languages";
import { Skills, SkillsData, useSkillsData } from "@/shared/data/skills";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { IconTextComponent } from "@/shared/ui/IconTextComponent/IconTextComponent";

import styles from "./UserInfoCard.module.scss";
import { formatDate } from "@/shared/lib/formatDate";
import { useGetFullName } from "@/shared/lib/getFullName";

interface UserInfoCardProps {
    user?: Host | VolunteerApi;
    infoOpenedChange: () => void;
    className?: string;
    locale: Locale;
}

type SkillsMap = {
    [key in Skills]?: SkillsData;
};

export const UserInfoCard: FC<UserInfoCardProps> = (props) => {
    const {
        user, infoOpenedChange, className, locale,
    } = props;
    const { skillsData } = useSkillsData();
    const languages = user && "languages" in user ? user.languages : null;
    const textLanguages = useFormatLanguages(languages ?? []);
    const { getFullName } = useGetFullName();
    const navigate = useNavigate();

    const navigateToVolunteer = useCallback((id: string) => {
        navigate(getVolunteerPersonalPageUrl(locale, id));
    }, [locale, navigate]);

    const navigateToHost = useCallback((id: string) => {
        navigate(getHostPersonalPageUrl(locale, id));
    }, [locale, navigate]);

    if (!user) {
        return null;
    }

    if ("profile" in user) {
        const { profile, skills } = user;

        const renderSkillsCard = () => {
            if (!skills || skills.length === 0) {
                return <span>Волонтёр не указал умения</span>;
            }

            const skillsMap: SkillsMap = skillsData.reduce(
                (acc: SkillsMap, cur) => {
                    acc[cur.id] = cur;
                    return acc;
                },
                {},
            );
            return skills.map((item) => {
                const skill = skillsMap[item];
                return (
                    skill && (
                        <IconTextComponent
                            text={skill.text}
                            icon={skill.icon}
                            alt={skill.text}
                            key={skill.id}
                        />
                    )
                );
            });
        };

        const formatLocation = (country?: string, city?: string) => {
            if (country && city) return `${country}, ${city}`;
            return country ?? city ?? "";
        };

        return (
            <div className={cn(styles.wrapper, className)}>
                <div className={styles.top}>
                    <span>Информация</span>
                    <ReactSVG
                        src={exitIcon}
                        className={styles.exitIcon}
                        onClick={() => infoOpenedChange()}
                    />
                </div>
                <div className={styles.content}>
                    <div
                        className={styles.info}
                        onClick={() => navigateToVolunteer(user.profile.id)}
                    >
                        <Avatar
                            icon={getMediaContent(profile.image)}
                            size="LARGE"
                        />
                        <div className={styles.userInfo}>
                            <span className={styles.textCaption}>
                                {`Волонтёр ${formatDate(locale, profile.birthDate)}`}
                            </span>
                            <span
                                className={styles.textPrimary}
                            >
                                {getFullName(profile.firstName, profile.lastName)}
                            </span>
                            <span className={styles.textCaption}>
                                {formatLocation(profile.country, profile.city)}
                            </span>
                        </div>
                    </div>
                    <div className={styles.skills}>
                        <span className={styles.textCaption}>Умения</span>
                        {renderSkillsCard()}
                    </div>
                    <div className={styles.languages}>
                        <span className={styles.textCaption}>
                            Владение языками
                        </span>
                        <div>
                            {languages && languages.length !== 0
                                ? textLanguages
                                : "Языки не были указаны"}
                        </div>
                    </div>
                    {/* <div className={styles.cases}>
                        <span className={styles.textCaption}>
                            Участвовал в проектах
                        </span>
                        <div className={styles.casesList}>{renderCasesList}</div>
                    </div> */}
                    {/* Not in backend */}
                    {/* <div className={styles.dates}>
                        <div className={styles.date}>
                            <span className={styles.textCaption}>
                                Дата прибытия
                            </span>
                            <span className={styles.text}>20.10.2023</span>
                        </div>
                        <div className={styles.date}>
                            <span className={styles.textCaption}>
                                Дата окончания
                            </span>
                            <span className={styles.text}>30.10.2023</span>
                        </div>
                    </div> */}
                </div>
            </div>
        );
    }

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <span>Информация</span>
                <ReactSVG
                    src={exitIcon}
                    className={styles.exitIcon}
                    onClick={() => infoOpenedChange()}
                />
            </div>
            <div className={styles.content}>
                <div
                    className={styles.info}
                    onClick={() => navigateToHost(user.id)}
                >
                    <Avatar icon={getMediaContent(user.avatar)} size="LARGE" />
                    <div className={styles.userInfo}>
                        <span className={styles.textCaption}>Организатор</span>
                        <span className={styles.textPrimary}>{user.name}</span>
                        <span className={styles.textCaption}>
                            {user.address}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
