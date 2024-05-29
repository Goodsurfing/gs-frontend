import React, { FC, useState } from "react";
import cn from "classnames";
import { ReactSVG } from "react-svg";
import styles from "./Chat.module.scss";
import chatIcon from "@/shared/assets/icons/chat.svg";
import { Message, UserChatType, UserInfoCard } from "@/entities/Messenger";
import { UserSettings } from "@/features/Messenger";
import arrowIcon from "@/shared/assets/icons/accordion-arrow.svg";

interface ChatProps {
    id: string;
    isEmpty: boolean;
    className?: string;
    user: UserChatType;
    messages: Message[];
}

export const Chat: FC<ChatProps> = (props) => {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id, className, isEmpty, messages, user,
    } = props;

    const [isInfoOpened, setInfoOpened] = useState<boolean>(true);

    if (isEmpty) {
        return (
            <div className={cn(styles.wrapper, styles.empty, className)}>
                <ReactSVG src={chatIcon} className={styles.chatIcon} />
                <span>Выберите, кому хотели бы написать</span>
            </div>
        );
    }

    const infoOpenedChange = () => {
        setInfoOpened((prev) => !prev);
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            <div style={{ flexGrow: 1 }}>
                <div className={styles.topTab}>
                    <span className={styles.userName}>{user.name}</span>
                    <div className={styles.settingsInfo}>
                        <UserSettings />
                        <ReactSVG
                            src={arrowIcon}
                            className={styles.openInfo}
                            onClick={() => setInfoOpened((prev) => !prev)}
                        />
                    </div>
                </div>
                Chat
                {id}
            </div>
            {isInfoOpened && <UserInfoCard user={user} infoOpenedChange={infoOpenedChange} />}
        </div>
    );
};
