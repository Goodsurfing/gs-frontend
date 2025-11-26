import React, {
    FC, memo,
} from "react";

import { useTranslation } from "react-i18next";

// import { medalsData } from "@/shared/data/medals";
import { getMediaContent } from "@/shared/lib/getMediaContent";
// import memberIcon from "@/shared/assets/icons/select-check.svg";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import { useLanguagesWithComma } from "@/shared/data/languages";
import { getAge } from "@/shared/lib/getAge";
import { useGetFullName } from "@/shared/lib/getFullName";
import { Profile } from "@/entities/Profile";
import styles from "./VolunteerHeaderCard.module.scss";

interface VolunteerHeaderCardProps {
    profileData: Profile;
    showButtons: boolean;
    isAuth: boolean;
    isShowWriteButton: boolean;
    handleWriteClick: () => void;
    handleEditClick: () => void;
}

export const VolunteerHeaderCard: FC<VolunteerHeaderCardProps> = memo(
    (props: VolunteerHeaderCardProps) => {
        const {
            profileData,
            showButtons,
            isAuth,
            handleWriteClick,
            handleEditClick,
            isShowWriteButton,
        } = props;

        const { t } = useTranslation("profile");
        const { getFullName } = useGetFullName();

        const {
            image, firstName, lastName, birthDate, country, city, volunteer, host,
        } = profileData;
        const languages = useLanguagesWithComma(volunteer?.languages ?? []);
        const renderName = getFullName(firstName, lastName);

        const renderLanguages = () => {
            if (
                volunteer && volunteer.languages.length > 0
            ) {
                return <span>{languages}</span>;
            }
            return <span>{t("personal.Языки не были указаны")}</span>;
        };

        const renderButtons = (
            <div className={styles.buttons}>
                {(showButtons && isAuth) && (
                    <Button
                        className={styles.buttonEdit}
                        size="SMALL"
                        color="BLUE"
                        variant="OUTLINE"
                        onClick={handleEditClick}
                    >
                        {t("personal.Редактировать")}
                    </Button>
                )}

                {(isShowWriteButton && (!showButtons && isAuth)) && (
                    <Button
                        size="SMALL"
                        color="BLUE"
                        variant="FILL"
                        className={styles.button}
                        onClick={handleWriteClick}
                    >
                        {t("personal.Написать")}
                    </Button>
                )}
            </div>
        );

        const getRole = () => {
            const roles = [];
            if (volunteer) roles.push(t("personal.Волонтёр"));
            if (host) roles.push(t("personal.Организатор"));

            return roles.length ? roles.join(", ") : "";
        };

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
                                {getRole()}
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
                                {t("personal.Город")}
                                :
                                {" "}
                                <span className={styles.subText}>
                                    {country || t("personal.Страна не указана")}
                                    ,
                                    {" "}
                                    {city || t("personal.Город не указан")}
                                </span>
                            </span>
                            <span className={styles.languages}>
                                {t("personal.Языки")}
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
