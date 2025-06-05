import cn from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Chat, MessengerList } from "@/widgets/Messenger";

import { getMessengerPageUrl } from "@/shared/config/routes/AppUrls";
import Preloader from "@/shared/ui/Preloader/Preloader";

import styles from "./MessengerPage.module.scss";
import { Profile, useLazyGetProfileInfoQuery } from "@/entities/Profile";

const MessengerPage = () => {
    const { id: selectedChat, offerId } = useParams();
    const navigate = useNavigate();
    const { locale } = useLocale();
    const { ready } = useTranslation("offer");
    const [myProfileData, setMyProfileData] = useState<Profile | null>();

    const [getMyProfileData] = useLazyGetProfileInfoQuery();

    const fetchMyProfileData = useCallback(async () => {
        const result = await getMyProfileData().unwrap();
        setMyProfileData(result);
    }, [getMyProfileData]);

    useEffect(() => {
        fetchMyProfileData();
    }, [fetchMyProfileData]);

    const handleOnUserClick = useCallback(
        (value?: string) => {
            if (selectedChat !== value) {
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

    if (!ready || !myProfileData) {
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
                        myProfileData={myProfileData}
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
