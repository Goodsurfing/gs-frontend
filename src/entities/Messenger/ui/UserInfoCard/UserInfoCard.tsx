import cn from "classnames";
import React, { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";

import { useTranslation } from "react-i18next";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

import exitIcon from "@/shared/assets/icons/delete.svg";
import {
    getHostPersonalPageUrl,
    getVolunteerPersonalPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useFormatLanguages } from "@/shared/data/languages";
import { useSkillsData } from "@/shared/data/skills";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { IconTextComponent } from "@/shared/ui/IconTextComponent/IconTextComponent";

import styles from "./UserInfoCard.module.scss";
import { formatDate } from "@/shared/lib/formatDate";
import { useGetFullName } from "@/shared/lib/getFullName";
import { ProfileById } from "@/entities/Profile";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

interface UserInfoCardProps {
    user: ProfileById;
    infoOpenedChange: () => void;
    className?: string;
    locale: Locale;
}

export const UserInfoCard: FC<UserInfoCardProps> = (props) => {
    const {
        user, infoOpenedChange, className, locale,
    } = props;
    const {
        host, volunteer, image, birthDate, firstName, lastName,
        country, city,
    } = user;

    const { t } = useTranslation("messenger");
    const { getTranslation } = useSkillsData();
    const languages = user.volunteer?.languages ?? null;
    const textLanguages = useFormatLanguages(user.volunteer?.languages ?? []);
    const { getFullName } = useGetFullName();
    const navigate = useNavigate();

    const navigateToVolunteer = useCallback((id: string) => {
        navigate(getVolunteerPersonalPageUrl(locale, id));
    }, [locale, navigate]);

    const renderSkillsCard = () => {
        if (!volunteer) return null;
        if (!volunteer.skills || volunteer.skills.length === 0) {
            return <span>{t("Волонтёр не указал умения")}</span>;
        }

        return volunteer.skills.map((item) => (
            <IconTextComponent
                text={getTranslation(item.name) ?? ""}
                icon={getMediaContent(item.imagePath) ?? ""}
                alt={item.name}
                key={item.id}
            />
        ));
    };

    const formatLocation = (countryParam?: string | null, cityParam?: string | null) => {
        if (countryParam && cityParam) return `${countryParam}, ${cityParam}`;
        return countryParam ?? cityParam ?? "";
    };

    const getRole = () => {
        const roles = [];
        if (user.volunteer) roles.push(t("Волонтёр"));
        if (user.host) roles.push(t("Организатор"));

        return roles.length ? roles.join(", ") : "";
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <span>{t("Информация")}</span>
                <ReactSVG
                    src={exitIcon}
                    className={styles.exitIcon}
                    onClick={() => infoOpenedChange()}
                />
            </div>
            <div className={styles.content}>
                <div
                    className={styles.info}
                    onClick={() => navigateToVolunteer(user.id)}
                >
                    <Avatar
                        icon={getMediaContent(image?.thumbnails?.small)}
                        size="LARGE"
                    />
                    <div className={styles.userInfo}>
                        <span className={styles.textCaption}>
                            {getRole()}
                            {" "}
                            <br />
                            {formatDate(locale, birthDate)}
                        </span>
                        <span
                            className={styles.textPrimary}
                        >
                            {getFullName(firstName, lastName)}
                        </span>
                        <span className={styles.textCaption}>
                            {formatLocation(country, city)}
                        </span>
                    </div>
                </div>
                {host && (
                    <ButtonLink
                        className={styles.buttonHost}
                        type="outlined"
                        path={getHostPersonalPageUrl(locale, host.split("/").pop())}
                    >
                        {
                            t("Посмотреть организацию")
                        }
                    </ButtonLink>
                )}
                <div className={styles.skills}>
                    <span className={styles.textCaption}>{t("Умения")}</span>
                    {renderSkillsCard()}
                </div>
                <div className={styles.languages}>
                    <span className={styles.textCaption}>
                        {t("Владение языками")}
                    </span>
                    <div>
                        {languages && languages.length !== 0
                            ? textLanguages
                            : t("Языки не были указаны")}
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

    // return (
    //     <div className={cn(styles.wrapper, className)}>
    //         <div className={styles.top}>
    //             <span>{t("Информация")}</span>
    //             <ReactSVG
    //                 src={exitIcon}
    //                 className={styles.exitIcon}
    //                 onClick={() => infoOpenedChange()}
    //             />
    //         </div>
    //         <div className={styles.content}>
    //             <div
    //                 className={styles.info}
    //                 onClick={() => navigateToHost(user.id)}
    //             >
    //                 <Avatar icon={getMediaContent(user.avatar)} size="LARGE" />
    //                 <div className={styles.userInfo}>
    //                     <span className={styles.textCaption}>{t("Организатор")}</span>
    //                     <span className={styles.textPrimary}>{user.name}</span>
    //                     <span className={styles.textCaption}>
    //                         {user.address}
    //                     </span>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
};
