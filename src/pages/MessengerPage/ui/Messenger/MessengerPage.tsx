import React from "react";
import styles from "./MessengerPage.module.scss";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Chat, MessengerList } from "@/widgets/Messenger";
import { mockedChatUser, mockedMessages } from "@/entities/Messenger";

const MessengerPage = () => (
    <div className={styles.layout}>
        <MainHeader />
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Сообщения</h2>
            <div className={styles.content}>
                <MessengerList className={styles.userList} />
                <Chat
                    id="1"
                    isEmpty={false}
                    className={styles.chat}
                    messages={mockedMessages}
                    user={mockedChatUser}
                />
            </div>
        </div>
    </div>
);

export default MessengerPage;
