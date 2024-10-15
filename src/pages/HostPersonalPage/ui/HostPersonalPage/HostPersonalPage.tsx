import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Submenu } from "@/widgets/Submenu";

import { useGetHostByIdQuery } from "@/entities/Host";

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
    const { data: hostData, isError, isLoading } = useGetHostByIdQuery(id ?? "");

    if (!ready || isLoading) {
        return <Preloader />;
    }

    if (!id || !hostData || isError) {
        return (
            <div className={styles.wrapper}>
                <Text textSize="primary" text="Произошла ошибка" />
            </div>
        );
    }
    return (
        <div className={styles.wrapper}>
            <MainHeader />
            <div className={styles.content}>
                <HostlHeaderCard host={hostData} />
                <Submenu
                    className={styles.navMenu}
                    items={submenuItems}
                    buttons={(
                        <Button
                            size="SMALL"
                            color="BLUE"
                            variant="OUTLINE"
                            className={styles.button}
                        >
                            {t("personalHost.Написать организатору")}
                        </Button>
                    )}
                />
                <HostPageContent hostData={hostData} />
            </div>
            <Footer />
        </div>
    );
};
