import React from "react";

import { useParams } from "react-router-dom";
import { Text } from "@/shared/ui/Text/Text";

import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Footer } from "@/widgets/Footer";
import { HostlHeaderCard } from "../HostlHeaderCard/HostlHeaderCard";

import styles from "./HostPersonalPage.module.scss";
import { mockedHostData } from "../../model/data/mockedHostData";

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
            <div className={styles.content}>
                <HostlHeaderCard host={mockedHostData} />
            </div>
            <Footer />
        </div>
    );
};
