import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Submenu } from "@/widgets/Submenu";

import { useGetHostByIdQuery } from "@/entities/Host";
import { useGetProfileInfoQuery } from "@/entities/Profile";

import { getHostRegistrationUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { Text } from "@/shared/ui/Text/Text";

import { useSubmenuItems } from "../../model/data/submenuData";
import { HostPageContent } from "../HostPageContent/HostPageContent";
import { HostlHeaderCard } from "../HostlHeaderCard/HostlHeaderCard";
import styles from "./HostPersonalPage.module.scss";

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

    const navigateTo = () => {
        navigate(getHostRegistrationUrl(locale));
    };

    if (!ready || isLoading) {
        return <Preloader />;
    }

    if (!id || !hostData || isError || !myProfile) {
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

    const isEdit = myProfile.id === hostData.owner.id;

    return (
        <div className={styles.wrapper}>
            <MainHeader />
            <div className={styles.content}>
                <HostlHeaderCard
                    host={hostData}
                    isEdit={isEdit}
                    locale={locale}
                />
                <Submenu
                    className={styles.navMenu}
                    items={submenuItems}
                    buttons={
                        isEdit ? (
                            <Button
                                size="SMALL"
                                color="BLUE"
                                variant="OUTLINE"
                                className={styles.button}
                                onClick={navigateTo}
                            >
                                {t("personalHost.Редактировать профиль")}
                            </Button>
                        ) : null
                    }
                />
                <HostPageContent hostData={hostData} />
            </div>
            <Footer />
        </div>
    );
};
