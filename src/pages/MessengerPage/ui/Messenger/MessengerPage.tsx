import React, { useCallback, useState } from "react";
import cn from "classnames";
import styles from "./MessengerPage.module.scss";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Chat, MessengerList } from "@/widgets/Messenger";
import { mockedChatUser, mockedMessages } from "@/entities/Messenger";

const MessengerPage = () => {
    const [selectedChat, setSelectedChat] = useState<string | null>("1");

    const handleOnUserClick = useCallback((value: string | null) => {
        setSelectedChat(value);
    }, []);

    return (
        <div className={styles.layout}>
            <MainHeader />
            <div className={styles.wrapper}>
                <h2 className={styles.title}>Сообщения</h2>
                <div className={styles.content}>
                    <MessengerList
                        className={cn(styles.userList, { [styles.open]: !selectedChat })}
                        onUserClick={handleOnUserClick}
                    />
                    <Chat
                        id={selectedChat}
                        onChange={handleOnUserClick}
                        className={cn(styles.chat, { [styles.open]: selectedChat })}
                        messages={mockedMessages}
                        user={mockedChatUser}
                    />
                </div>
            </div>
        </div>
    );
};

export default MessengerPage;
