import React, { FC, useMemo } from "react";
import { ReactSVG } from "react-svg";

import cn from "classnames";
import { UserChatType } from "@/entities/Messenger";

import exitIcon from "@/shared/assets/icons/delete.svg";
import { useSkillsData } from "@/shared/data/skills";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { IconTextComponent } from "@/shared/ui/IconTextComponent/IconTextComponent";

import styles from "./UserInfoCard.module.scss";

interface UserInfoCardProps {
    user: UserChatType;
    infoOpenedChange: () => void;
    className?: string;
}

export const UserInfoCard: FC<UserInfoCardProps> = (props) => {
    const { user, infoOpenedChange, className } = props;
    const { skillsData } = useSkillsData();

    const renderLanguagesList = useMemo(
        () => user.languages.map((lang, index) => (
            <span key={index}>
                <span className={styles.lang}>{lang.language}</span>
                <span className={styles.langLevel}>
                    {" "}
                    /
                    {lang.level}
                </span>
                {index < user.languages.length - 1 ? ", " : ""}
            </span>
        )),
        [user.languages],
    );

    const renderCasesList = useMemo(() => {
        if (user.cases.length === 0) {
            return <span>-</span>;
        }
        return user.cases.map((caseItem, index) => (
            <div key={index} className={styles.caseItem}>
                <div className={styles.circle} />
                {caseItem}
            </div>
        ));
    }, [user.cases]);

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
                <div className={styles.info}>
                    <Avatar icon={user.avatar} size="LARGE" />
                    <div className={styles.userInfo}>
                        <span className={styles.textCaption}>
                            {user.description}
                        </span>
                        <span className={styles.textPrimary}>{user.name}</span>
                        <span className={styles.textCaption}>
                            {user.address}
                        </span>
                    </div>
                </div>
                <div className={styles.skills}>
                    <span className={styles.textCaption}>Умения</span>
                    <IconTextComponent
                        text={skillsData[0].text}
                        icon={skillsData[0].icon}
                        alt={skillsData[0].text}
                        key={skillsData[0].id}
                    />
                    <IconTextComponent
                        text={skillsData[1].text}
                        icon={skillsData[1].icon}
                        alt={skillsData[1].text}
                        key={skillsData[1].id}
                    />
                    <IconTextComponent
                        text={skillsData[2].text}
                        icon={skillsData[2].icon}
                        alt={skillsData[2].text}
                        key={skillsData[2].id}
                    />
                </div>
                <div className={styles.languages}>
                    <span className={styles.textCaption}>Владение языками</span>
                    <div>{renderLanguagesList}</div>
                </div>
                <div className={styles.cases}>
                    <span className={styles.textCaption}>
                        Участвовал в проектах
                    </span>
                    <div className={styles.casesList}>{renderCasesList}</div>
                </div>
                <div className={styles.dates}>
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
                </div>
            </div>
        </div>
    );
};
