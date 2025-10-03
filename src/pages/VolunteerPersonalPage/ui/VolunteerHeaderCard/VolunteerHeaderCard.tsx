import React, { FC, memo, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { VolunteerApi } from "@/entities/Volunteer";

// import { medalsData } from "@/shared/data/medals";
import { getMediaContent } from "@/shared/lib/getMediaContent";
// import memberIcon from "@/shared/assets/icons/select-check.svg";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import { getVolunteerDashboardPageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./VolunteerHeaderCard.module.scss";
import { Locale } from "@/entities/Locale";
import { useLanguagesWithComma } from "@/shared/data/languages";
import { getAge } from "@/shared/lib/getAge";
import { useGetFullName } from "@/shared/lib/getFullName";

interface VolunteerHeaderCardProps {
    volunteer: VolunteerApi;
    showButtons: boolean;
    locale: Locale;
    isAuth: boolean;
}

export const VolunteerHeaderCard: FC<VolunteerHeaderCardProps> = memo(
    (props: VolunteerHeaderCardProps) => {
        const {
            volunteer,
            showButtons,
            locale,
            isAuth,
        } = props;

        const { t } = useTranslation("volunteer");
        const { getFullName } = useGetFullName();
        const navigate = useNavigate();
        const {
            image, firstName, lastName, birthDate, country, city,
        } = volunteer.profile;
        const languages = useLanguagesWithComma(volunteer.languages);
        const renderName = getFullName(firstName, lastName);

        const renderLanguages = () => {
            if (
                volunteer.languages.length > 0
            ) {
                return <span>{languages}</span>;
            }
            return <span>{t("personalVolunteer.Языки не были указаны")}</span>;
        };

        const handleEditClick = useCallback(() => {
            navigate(getVolunteerDashboardPageUrl(locale));
        }, [locale, navigate]);

        const handleWriteClick = useCallback(() => {
            navigate(`/${locale}/messenger/create?recipientVolunteer=${volunteer.profile.id}`);
        }, [locale, navigate, volunteer.profile.id]);

        const renderButtons = (
            <>
                {(showButtons && isAuth) && (
                    <Button
                        size="SMALL"
                        color="BLUE"
                        variant="FILL"
                        onClick={handleEditClick}
                    >
                        {t("personalVolunteer.Редактировать")}
                    </Button>
                )}

                {(!showButtons && isAuth) && (
                    <Button
                        size="SMALL"
                        color="BLUE"
                        variant="FILL"
                        className={styles.button}
                        onClick={handleWriteClick}
                    >
                        {t("personalVolunteer.Написать")}
                    </Button>
                )}
            </>
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
                                {t("personalVolunteer.Волонтёр")}
                                {" "}
                                {getAge(birthDate)}
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
                            {renderName}
                        </h3>
                        <div className={styles.info}>
                            <span className={styles.address}>
                                {t("personalVolunteer.Город")}
                                :
                                {" "}
                                <span className={styles.subText}>
                                    {country || t("personalVolunteer.Страна не указана")}
                                    ,
                                    {" "}
                                    {city || t("personalVolunteer.Город не указан")}
                                </span>
                            </span>
                            <span className={styles.languages}>
                                {t("personalVolunteer.Языки")}
                                :
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
                        {/* fake data achievements */}
                        {/* {medalsData.slice(0, 2).map((medal, index) => (
                            <div className={styles.medal} key={index}>
                                <img
                                    className={styles.medalIcon}
                                    src={medal.icon}
                                    alt={medal.text}
                                />
                                <span>{medal.text}</span>
                            </div>
                        ))} */}
                    </div>
                    {renderButtons}
                </div>
            </div>
        );
    },
);
