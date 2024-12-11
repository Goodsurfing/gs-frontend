import cn from "classnames";
import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Chat, MessengerList } from "@/widgets/Messenger";

import { getMessengerPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./MessengerPage.module.scss";

const MessengerPage = () => {
    const { id: selectedChat, offerId } = useParams();
    const navigate = useNavigate();
    const { locale } = useLocale();

    const handleOnUserClick = useCallback(
        (value?: string) => {
            if (value) {
                navigate(`/${locale}/messenger/${value}`);
            } else {
                navigate(getMessengerPageUrl(locale));
            }
        },
        [locale, navigate],
    );

    return (
        <div className={styles.layout}>
            <MainHeader />
            <div className={styles.wrapper}>
                <h2 className={styles.title}>Сообщения</h2>
                <div className={styles.content}>
                    <MessengerList
                        className={cn(styles.userList, {
                            [styles.open]: !selectedChat,
                        })}
                        onUserClick={handleOnUserClick}
                    />
                    <Chat
                        id={selectedChat}
                        offerId={offerId}
                        onBackButton={handleOnUserClick}
                        className={cn(styles.chat, {
                            [styles.open]: selectedChat,
                        })}
                        locale={locale}
                    />
                </div>
            </div>
        </div>
    );
};

export default MessengerPage;
