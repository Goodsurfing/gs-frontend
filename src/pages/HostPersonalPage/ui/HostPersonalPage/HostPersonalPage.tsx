import React from "react";
import { useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Submenu } from "@/widgets/Submenu";

import { Text } from "@/shared/ui/Text/Text";

import { mockedHostData } from "@/entities/Host/model/data/mockedHostData";
import { useSubmenuItems } from "../../model/data/submenuData";
import { HostlHeaderCard } from "../HostlHeaderCard/HostlHeaderCard";
import styles from "./HostPersonalPage.module.scss";
import { HostPageContent } from "../HostPageContent/HostPageContent";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";

export const HostPersonalPage = () => {
    const { id } = useParams<{ id: string }>();
    const { t, ready } = useTranslation("host");
    const { submenuItems } = useSubmenuItems();

    if (!ready) {
        return <Preloader />;
    }

    if (!id) {
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
                <HostlHeaderCard host={mockedHostData} />
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
                <HostPageContent id={id} />
            </div>
            <Footer />
        </div>
    );
};
