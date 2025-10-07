import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Submenu } from "@/widgets/Submenu";

import { useGetHostByIdQuery } from "@/entities/Host";
import { useGetProfileInfoQuery } from "@/entities/Profile";

import { getHostRegistrationUrl, getMessengerPageIdUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { Text } from "@/shared/ui/Text/Text";

import { useSubmenuItems } from "../../model/data/submenuData";
import { HostPageContent } from "../HostPageContent/HostPageContent";
import { HostlHeaderCard } from "../HostlHeaderCard/HostlHeaderCard";
import styles from "./HostPersonalPage.module.scss";
import { useAuth } from "@/routes/model/guards/AuthProvider";

export const HostPersonalPage = () => {
    const { id } = useParams<{ id: string }>();
    const { t, ready } = useTranslation("host");
    const { submenuItems } = useSubmenuItems();
    const {
        data: hostData,
        isError,
        isLoading,
    } = useGetHostByIdQuery(id ?? "");
    const { data: myProfile } = useGetProfileInfoQuery();
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { isAuth } = useAuth();

    const handleEditClick = () => {
        navigate(getHostRegistrationUrl(locale));
    };

    const handleWriteClick = () => {
        navigate(`${getMessengerPageIdUrl(locale, "create")}?recipientOrganization=${id}`);
    };

    if (!ready || isLoading) {
        return <Preloader />;
    }

    if (!id || !hostData || isError) {
        return (
            <div className={styles.wrapper}>
                <MainHeader />
                <div className={styles.content}>
                    <Text textSize="primary" text="Произошла ошибка" />
                </div>
                <Footer />
            </div>
        );
    }

    const showEditButton = !!myProfile && myProfile.id === hostData.owner.id;

    const renderButtons = (
        <>
            {(showEditButton && isAuth) && (
                <Button
                    size="SMALL"
                    color="BLUE"
                    variant="OUTLINE"
                    className={styles.button}
                    onClick={handleEditClick}
                >
                    {t("personalHost.Редактировать профиль")}
                </Button>
            )}

            {(!showEditButton && isAuth) && (
                <Button
                    size="SMALL"
                    color="BLUE"
                    variant="FILL"
                    className={styles.button}
                    onClick={handleWriteClick}
                >
                    {t("personalHost.Написать")}
                </Button>
            )}
        </>
    );

    return (
        <div className={styles.wrapper}>
            <MainHeader />
            <div className={styles.content}>
                <HostlHeaderCard
                    host={hostData}
                    isEdit={showEditButton}
                    locale={locale}
                    isAuth={isAuth}
                />
                <Submenu
                    className={styles.navMenu}
                    items={submenuItems}
                    buttons={renderButtons}
                />
                <HostPageContent hostData={hostData} />
            </div>
            <Footer />
        </div>
    );
};
