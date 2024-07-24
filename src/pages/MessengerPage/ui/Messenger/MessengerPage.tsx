import React, { useCallback } from "react";
import cn from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Chat, MessengerList } from "@/widgets/Messenger";
import { mockedChatUser, mockedMessages } from "@/entities/Messenger";
import styles from "./MessengerPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

const MessengerPage = () => {
    // const [selectedChat, setSelectedChat] = useState<string | null>("create");
    const { id: selectedChat } = useParams();
    const navigate = useNavigate();
    const { locale } = useLocale();

    const handleOnUserClick = useCallback((value: string | null) => {
        if (value) {
            navigate(`/${locale}/messenger/${value}`);
        } else {
            navigate(`/${locale}/messenger`);
        }
    }, [locale, navigate]);

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
                        id={selectedChat || null}
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
