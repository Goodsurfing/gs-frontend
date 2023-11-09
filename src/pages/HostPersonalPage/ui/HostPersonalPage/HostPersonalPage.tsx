import React from "react";
import { useParams } from "react-router-dom";

import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Submenu } from "@/widgets/Submenu";

import { Text } from "@/shared/ui/Text/Text";

import { mockedHostData } from "../../model/data/mockedHostData";
import { SubmenuItems } from "../../model/data/submenuData";
import { HostlHeaderCard } from "../HostlHeaderCard/HostlHeaderCard";
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
            <div className={styles.content}>
                <HostlHeaderCard host={mockedHostData} />
                <Submenu className={styles.navMenu} items={SubmenuItems} />
            </div>
            <Footer />
        </div>
    );
};
