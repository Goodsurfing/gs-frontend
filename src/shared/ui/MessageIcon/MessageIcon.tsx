import React, { FC } from "react";
import { ReactSVG } from "react-svg";
import messagesIcon from "@/shared/assets/icons/message_icon.svg";
import styles from "./MessegeIcon.module.scss";

interface MessageIconProps {
    count: number;
}

export const MessageIcon: FC<MessageIconProps> = (props) => {
    const { count } = props;
    const renderCounter = count > 9 ? "9+" : count;

    return (
        <div className={styles.wrapper}>
            <ReactSVG className={styles.icon} src={messagesIcon} />
            {count > 0 && (
                <div className={styles.messageCounter}>
                    {renderCounter}
                </div>
            )}
        </div>
    );
};
