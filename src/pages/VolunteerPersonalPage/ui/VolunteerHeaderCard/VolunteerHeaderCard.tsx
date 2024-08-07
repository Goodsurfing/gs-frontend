import React, { FC, memo } from "react";

import { Volunteer } from "@/entities/Volunteer";

import memberIcon from "@/shared/assets/icons/select-check.svg";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import styles from "./VolunteerHeaderCard.module.scss";
import { medalsData } from "@/shared/data/medals";

interface VolunteerHeaderCardProps {
    id: string;
    volunteer: Volunteer;
}

export const VolunteerHeaderCard: FC<VolunteerHeaderCardProps> = memo(
    (props: VolunteerHeaderCardProps) => {
        const {
            volunteer: {
                firstName,
                lastName,
                image,
                isMember,
                country,
                city,
                birthDate,
                languages,
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            id,
        } = props;

        return (
            <div className={styles.wrapper}>
                <div className={styles.mainInfo}>
                    <Avatar
                        icon={image?.contentUrl}
                        className={styles.image}
                        alt="avatar"
                    />
                    <div className={styles.containerInfo}>
                        <div>
                            <span className={styles.birthDate}>
                                Волонтёр,
                                {" "}
                                {birthDate}
                            </span>
                            {isMember && (
                                <img
                                    src={memberIcon}
                                    className={styles.memberIcon}
                                    alt="goodsurfing member"
                                />
                            )}
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
                                    {languages && languages.length > 0 ? (
                                        <span style={{ color: "black" }}>
                                            {languages.map(({ language }, index) => (
                                                <React.Fragment key={index}>
                                                    {language}
                                                    {index < languages.length - 1 && ", "}
                                                </React.Fragment>
                                            ))}
                                        </span>
                                    ) : (
                                        <span>Языки не были указаны</span>
                                    )}
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
                    <Button color="BLUE" size="SMALL" variant="FILL">
                        Редактировать профиль
                    </Button>
                </div>
            </div>
        );
    },
);
