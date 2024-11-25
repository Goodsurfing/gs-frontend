import React, { FC, memo, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { VolunteerApi } from "@/entities/Volunteer";

import { medalsData } from "@/shared/data/medals";
import { getMediaContent } from "@/shared/lib/getMediaContent";
// import memberIcon from "@/shared/assets/icons/select-check.svg";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import { getMessengerPageUrl, getVolunteerDashboardPageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./VolunteerHeaderCard.module.scss";
import { formatDate } from "@/shared/lib/formatDate";
import { Locale } from "@/entities/Locale";

interface VolunteerHeaderCardProps {
    volunteer: VolunteerApi;
    showButtons: boolean;
    locale: Locale;
}

export const VolunteerHeaderCard: FC<VolunteerHeaderCardProps> = memo(
    (props: VolunteerHeaderCardProps) => {
        const {
            volunteer,
            showButtons,
            locale,
        } = props;

        const navigate = useNavigate();
        const {
            image, firstName, lastName, birthDate, country, city,
        } = volunteer.profile;

        const renderLanguages = () => {
            if (
                volunteer
                && volunteer.languages
                && volunteer.languages.length > 0
            ) {
                return (
                    <span style={{ color: "black" }}>
                        {volunteer.languages.map(({ language }, index) => (
                            <React.Fragment key={index}>
                                {language}
                                {index < volunteer.languages.length - 1 && ", "}
                            </React.Fragment>
                        ))}
                    </span>
                );
            }
            return <span>Языки не были указаны</span>;
        };

        const handleEditClick = useCallback(() => {
            navigate(getVolunteerDashboardPageUrl(locale));
        }, [locale, navigate]);

        const handleMessageClick = useCallback(() => {
            navigate(getMessengerPageUrl(locale));
        }, [locale, navigate]);

        const renderButtons = showButtons ? (
            <Button color="BLUE" size="SMALL" variant="FILL" onClick={handleEditClick}>
                Редактировать
            </Button>

        ) : (
            <Button color="BLUE" size="SMALL" variant="FILL" onClick={handleMessageClick}>
                Написать
            </Button>
        );

        return (
            <div className={styles.wrapper}>
                <div className={styles.mainInfo}>
                    <Avatar
                        icon={getMediaContent(image?.contentUrl)}
                        className={styles.image}
                        alt="avatar"
                    />
                    <div className={styles.containerInfo}>
                        <div>
                            <span className={styles.birthDate}>
                                Волонтёр
                                {" "}
                                {birthDate && (
                                    formatDate(locale, birthDate ?? "")
                                )}
                            </span>
                            {/* {isMember && (
                                <img
                                    src={memberIcon}
                                    className={styles.memberIcon}
                                    alt="member"
                                />
                            )} */}
                        </div>
                        <h3 className={styles.name}>
                            {firstName}
                            {" "}
                            {lastName}
                        </h3>
                        <div className={styles.info}>
                            <span className={styles.address}>
                                Город:
                                {" "}
                                <span className={styles.subText}>
                                    {country || "Страна не указана"}
                                    ,
                                    {" "}
                                    {city || "Город не указан"}
                                </span>
                            </span>
                            <span className={styles.languages}>
                                Языки:
                                {" "}
                                <span className={styles.subText}>
                                    {renderLanguages()}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className={styles.btnMedalsContainer}>
                    <div className={styles.medalContainer}>
                        {medalsData.slice(0, 2).map((medal, index) => (
                            <div className={styles.medal} key={index}>
                                <img
                                    className={styles.medalIcon}
                                    src={medal.icon}
                                    alt={medal.text}
                                />
                                <span>{medal.text}</span>
                            </div>
                        ))}
                    </div>
                    {renderButtons}
                </div>
            </div>
        );
    },
);
