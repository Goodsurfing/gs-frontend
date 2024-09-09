import React from "react";
import { useParams } from "react-router-dom";

import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Submenu } from "@/widgets/Submenu";

import { useGetVolunteerByIdQuery } from "@/entities/Volunteer";

import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { Text } from "@/shared/ui/Text/Text";

import { SubmenuVolunteerData } from "../../model/data/submenuData";
import { VolunteerHeaderCard } from "../VolunteerHeaderCard/VolunteerHeaderCard";
import { VolunteerPageContent } from "../VolunteerPageContent/VolunteerPageContent";
import styles from "./VolunteerPersonalPage.module.scss";

export const VolunteerPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: volunteerData, isLoading } = useGetVolunteerByIdQuery(
        id || "",
    );

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <Preloader />
            </div>
        );
    }

    if (!id || !volunteerData) {
        return (
            <div className={styles.wrapper}>
                <MainHeader />
                <div className={styles.content}>
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text="Произошла ошибка"
                    />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <MainHeader />
            <div className={styles.content}>
                <VolunteerHeaderCard id={id} volunteer={volunteerData} />
                <Submenu
                    className={styles.navMenu}
                    items={SubmenuVolunteerData}
                    buttons={(
                        <>
                            <Button
                                size="SMALL"
                                color="BLUE"
                                variant="OUTLINE"
                                className={styles.button}
                            >
                                Написать
                            </Button>
                            <Button
                                size="SMALL"
                                color="BLUE"
                                variant="FILL"
                                className={styles.button}
                            >
                                Участвовать
                            </Button>
                        </>
                    )}
                />
                <VolunteerPageContent volunteer={volunteerData} />
            </div>
            <Footer />
        </div>
    );
};
