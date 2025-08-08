import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Submenu } from "@/widgets/Submenu";

import { useGetProfileInfoQuery } from "@/entities/Profile";
import { useGetVolunteerByIdQuery } from "@/entities/Volunteer";

import {
    getVolunteerDashboardPageUrl,
} from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { Text } from "@/shared/ui/Text/Text";

import { useSubmenuVolunteerItems } from "../../model/data/submenuData";
import { VolunteerHeaderCard } from "../VolunteerHeaderCard/VolunteerHeaderCard";
import { VolunteerPageContent } from "../VolunteerPageContent/VolunteerPageContent";
import styles from "./VolunteerPersonalPage.module.scss";

export const VolunteerPersonalPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { locale } = useLocale();
    const { t, ready } = useTranslation("volunteer");
    const { submenuItems } = useSubmenuVolunteerItems();

    const { data: volunteerData, isLoading } = useGetVolunteerByIdQuery(
        id || "",
    );
    const { data: myProfileData } = useGetProfileInfoQuery();

    const handleEditClick = () => {
        navigate(getVolunteerDashboardPageUrl(locale));
    };

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
                        text={t("personalVolunteer.Произошла ошибка")}
                    />
                </div>
                <Footer />
            </div>
        );
    }

    if (!volunteerData) {
        return (
            <div className={styles.wrapper}>
                <MainHeader />
                <div className={styles.content}>
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text={t("personalVolunteer.Произошла ошибка или пользователь не зарегистрирован как волонтёр")}
                    />
                </div>
                <Footer />
            </div>
        );
    }

    const showButtons = myProfileData ? (
        myProfileData.id === id) : false;

    const renderButtons = showButtons ? (
        <Button
            size="SMALL"
            color="BLUE"
            variant="FILL"
            className={styles.button}
            onClick={handleEditClick}
        >
            {t("personalVolunteer.Редактировать")}
        </Button>

    ) : null;

    return (
        <div className={styles.wrapper}>
            <MainHeader />
            <div className={styles.content}>
                <VolunteerHeaderCard
                    volunteer={volunteerData}
                    showButtons={showButtons}
                    locale={locale}
                />
                <Submenu
                    className={styles.navMenu}
                    items={submenuItems}
                    buttons={renderButtons}
                />
                <VolunteerPageContent volunteer={volunteerData} />
            </div>
            <Footer />
        </div>
    );
};
