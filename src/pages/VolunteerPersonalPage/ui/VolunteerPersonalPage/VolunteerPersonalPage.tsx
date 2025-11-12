import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useLocale } from "@/app/providers/LocaleProvider";

import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Submenu } from "@/widgets/Submenu";

import { useGetProfileInfoQuery, useGetProfileInfoByIdQuery } from "@/entities/Profile";

import {
    getMessengerPageIdUrl,
    getVolunteerDashboardPageUrl,
} from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { Text } from "@/shared/ui/Text/Text";

import { useSubmenuVolunteerItems } from "../../model/data/submenuData";
import { VolunteerHeaderCard } from "../VolunteerHeaderCard/VolunteerHeaderCard";
import { VolunteerPageContent } from "../VolunteerPageContent/VolunteerPageContent";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import styles from "./VolunteerPersonalPage.module.scss";
import { useLazyGetMyChatsListQuery } from "@/entities/Chat";

export const VolunteerPersonalPage = () => {
    const { id } = useParams<{ id: string }>();
    const [getMyChatsList, { data: myChatsListData }] = useLazyGetMyChatsListQuery();
    const navigate = useNavigate();
    const { locale } = useLocale();
    const { t, ready } = useTranslation("profile");
    const { submenuItems } = useSubmenuVolunteerItems();
    const { isAuth } = useAuth();

    const { data: profileData, isLoading } = useGetProfileInfoByIdQuery(
        id || "",
    );
    const { data: myProfileData } = useGetProfileInfoQuery();

    const handleEditClick = () => {
        navigate(getVolunteerDashboardPageUrl(locale));
    };

    const handleWriteClick = () => {
        if (myChatsListData) {
            const isChatExist = myChatsListData.length > 0;
            if (isChatExist) {
                const chatId = myChatsListData[0].id;
                navigate(getMessengerPageIdUrl(locale, chatId.toString()));
                return;
            }
            navigate(`${getMessengerPageIdUrl(locale, "create")}?recipientVolunteer=${id}`);
        }
    };

    const fetchMyChatsList = useCallback(async () => {
        if (id) {
            await getMyChatsList({ params: { participantId: id } });
        }
    }, [getMyChatsList, id]);

    useEffect(() => {
        fetchMyChatsList();
    }, [fetchMyChatsList, id]);

    if (isLoading || !ready) {
        return (
            <div className={styles.wrapper}>
                <Preloader />
            </div>
        );
    }

    if (!id) {
        return (
            <div className={styles.wrapper}>
                <MainHeader />
                <div className={styles.content}>
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text={t("personal.Произошла ошибка")}
                    />
                </div>
                <Footer />
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className={styles.wrapper}>
                <MainHeader />
                <div className={styles.content}>
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text={t("personal.Произошла ошибка или пользователь не зарегистрирован как волонтёр")}
                    />
                </div>
                <Footer />
            </div>
        );
    }

    const showEditButton = !!myProfileData && myProfileData.id === id;

    const renderButtons = (
        <>
            {(showEditButton && isAuth) && (
                <Button
                    size="SMALL"
                    color="BLUE"
                    variant="OUTLINE"
                    className={cn(styles.button, styles.buttonEdit)}
                    onClick={handleEditClick}
                >
                    {t("personal.Редактировать")}
                </Button>
            )}

            {(myChatsListData && (!showEditButton && isAuth)) && (
                <Button
                    size="SMALL"
                    color="BLUE"
                    variant="FILL"
                    className={styles.button}
                    onClick={handleWriteClick}
                >
                    {t("personal.Написать")}
                </Button>
            )}
        </>
    );

    return (
        <div className={styles.wrapper}>
            <MainHeader />
            <div className={styles.content}>
                <VolunteerHeaderCard
                    profileData={profileData}
                    showButtons={showEditButton}
                    isAuth={isAuth}
                    isShowWriteButton={!!myChatsListData}
                    handleEditClick={handleEditClick}
                    handleWriteClick={handleWriteClick}
                />
                <Submenu
                    className={styles.navMenu}
                    items={submenuItems}
                    buttons={renderButtons}
                />
                <VolunteerPageContent profileData={profileData} />
            </div>
            <Footer />
        </div>
    );
};
