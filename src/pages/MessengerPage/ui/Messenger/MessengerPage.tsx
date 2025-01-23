import cn from "classnames";
import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Chat, MessengerList } from "@/widgets/Messenger";

import { getMessengerPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./MessengerPage.module.scss";
import Preloader from "@/shared/ui/Preloader/Preloader";

const MessengerPage = () => {
    const { id: selectedChat, offerId } = useParams();
    const navigate = useNavigate();
    const { locale } = useLocale();
    const { ready } = useTranslation("offer");

    const handleOnUserClick = useCallback(
        (value?: string) => {
            if ((selectedChat !== value)) {
                if (value) {
                    navigate(`/${locale}/messenger/${value}`);
                } else {
                    navigate(getMessengerPageUrl(locale));
                }
            } else {
                navigate(getMessengerPageUrl(locale));
            }
        },
        [locale, navigate, selectedChat],
    );

    if (!ready) {
        return (
            <div className={styles.layout}>
                <MainHeader />
                <Preloader />
            </div>
        );
    }

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
                        locale={locale}
                    />
                    <Chat
                        key={selectedChat}
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
