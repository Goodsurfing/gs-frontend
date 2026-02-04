import React, {
    FC, memo,
    useState,
} from "react";

import { useTranslation } from "react-i18next";

// import { medalsData } from "@/shared/data/medals";
import { ReactSVG } from "react-svg";
import { getMediaContent } from "@/shared/lib/getMediaContent";
// import memberIcon from "@/shared/assets/icons/select-check.svg";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";
import {
    facebookIcon,
    instaIcon,
    telegramIcon,
    vkIcon,
} from "@/shared/data/icons/socialIcons";
import threeDotsIcon from "@/shared/assets/icons/three-dots.svg";

import { useLanguagesWithComma } from "@/shared/data/languages";
import { getAge } from "@/shared/lib/getAge";
import { useGetFullName } from "@/shared/lib/getFullName";
import { ProfileById } from "@/entities/Profile";
import styles from "./VolunteerHeaderCard.module.scss";
import { AchievementModal } from "@/entities/Volunteer";

interface VolunteerHeaderCardProps {
    profileData: ProfileById;
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
        const [isModalAchievementOpen, setIsModalAchievementOpen] = useState(false);

        const {
            image, firstName, lastName, birthDate, country, city, volunteer, hostId,
            vk, telegram, facebook, instagram,
        } = profileData;
        const languages = useLanguagesWithComma(volunteer?.languages ?? []);
        const renderName = getFullName(firstName, lastName);

        const handleOpenModalAchievement = () => {
            setIsModalAchievementOpen(true);
        };

        const handleCloseModalAchievement = () => {
            setIsModalAchievementOpen(false);
        };

        const renderLanguages = () => {
            if (
                volunteer && volunteer.languages.length > 0
            ) {
                return <span>{languages}</span>;
            }
            return <span>{t("personal.Языки не были указаны")}</span>;
        };

        const renderAchievements = () => {
            if (volunteer && volunteer.achievements.length > 0) {
                if (volunteer.achievements.length > 3) {
                    const resultAchievements = volunteer.achievements.slice(0, 2).map((medal) => (
                        <div className={styles.medal} key={medal.id}>
                            <img
                                className={styles.medalIcon}
                                src={getMediaContent(medal.image.contentUrl)}
                                alt={medal.name}
                            />
                            <span>{medal.name}</span>
                        </div>
                    ));
                    resultAchievements.push(
                        <div
                            className={styles.medal}
                            style={{ cursor: "pointer" }}
                            key="three-dots"
                            onClick={handleOpenModalAchievement}
                        >
                            <div className={styles.more}>
                                <ReactSVG
                                    className={styles.medalIcon}
                                    src={threeDotsIcon}
                                />
                            </div>
                            <span>{t("personal.Ещё")}</span>
                        </div>,
                    );
                    return resultAchievements;
                }
                return volunteer.achievements.map((medal) => (
                    <div className={styles.medal} key={medal.id}>
                        <img
                            className={styles.medalIcon}
                            src={getMediaContent(medal.image.contentUrl)}
                            alt={medal.name}
                        />
                        <span>{medal.name}</span>
                    </div>
                ));
            }
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
            if (hostId) roles.push(t("personal.Организатор"));

            return roles.length ? roles.join(", ") : "";
        };

        return (
            <>
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
                                <div className={styles.socials}>
                                    {vk !== "" && (
                                        <a href={vk ?? undefined} target="_blank" rel="noreferrer" className={styles.social}>
                                            <ReactSVG src={vkIcon} />
                                            <p className={styles.socialLabel}>Вконтакте</p>
                                        </a>
                                    )}
                                    {telegram !== "" && (
                                        <a href={telegram ?? undefined} target="_blank" rel="noreferrer" className={styles.social}>
                                            <ReactSVG src={telegramIcon} />
                                            <p className={styles.socialLabel}>Telegram</p>
                                        </a>
                                    )}
                                    {facebook !== "" && (
                                        <a href={facebook ?? undefined} target="_blank" rel="noreferrer" className={styles.social}>
                                            <ReactSVG src={facebookIcon} />
                                            <p className={styles.socialLabel}>Facebook</p>
                                        </a>
                                    )}
                                    {instagram !== "" && (
                                        <a href={instagram ?? undefined} target="_blank" rel="noreferrer" className={styles.social}>
                                            <ReactSVG src={instaIcon} />
                                            <p className={styles.socialLabel}>Instagram</p>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.btnMedalsContainer}>
                        <div className={styles.medalContainer}>
                            {renderAchievements()}
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
                <AchievementModal
                    achievements={volunteer?.achievements ?? []}
                    isModalOpen={isModalAchievementOpen}
                    onClose={handleCloseModalAchievement}
                />
            </>
        );
    },
);
