import React from "react";

import { useParams } from "react-router-dom";
import { Text } from "@/shared/ui/Text/Text";

import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Footer } from "@/widgets/Footer";
import styles from "./HostPersonalPage.module.scss";

export const HostPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

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
            <div className={styles.content}>host personal page</div>
            <Footer />
        </div>
    );
};
