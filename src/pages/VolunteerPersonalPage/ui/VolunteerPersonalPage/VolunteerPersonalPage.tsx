import React from "react";
import { useParams } from "react-router-dom";

import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Submenu } from "@/widgets/Submenu";

import { Text } from "@/shared/ui/Text/Text";

import { SubmenuVolunteerData } from "../../model/data/submenuData";
import { VolunteerlHeaderCard } from "../VolunteerHeaderCard/VolunteerHeaderCard";
import styles from "./VolunteerPersonalPage.module.scss";

const VolunteerPersonalPage = () => {
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
                <VolunteerlHeaderCard id={id} />
                <Submenu
                    className={styles.navMenu}
                    items={SubmenuVolunteerData}
                />
                <VolunteerPageContent id={id} />
            </div>
            <Footer />
        </div>
    );
};

export default VolunteerPersonalPage;
