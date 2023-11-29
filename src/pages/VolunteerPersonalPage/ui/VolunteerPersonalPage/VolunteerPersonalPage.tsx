import React from "react";
import { useParams } from "react-router-dom";

import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Submenu } from "@/widgets/Submenu";

import { mockedVolunteerData } from "@/entities/Volunteer/model/data/mockedVolunteerData";

import { Text } from "@/shared/ui/Text/Text";

import { SubmenuVolunteerData } from "../../model/data/submenuData";
import { VolunteerHeaderCard } from "../VolunteerHeaderCard/VolunteerHeaderCard";
import { VolunteerPageContent } from "../VolunteerPageContent/VolunteerPageContent";
import styles from "./VolunteerPersonalPage.module.scss";
import Button from "@/shared/ui/Button/Button";

export const VolunteerPersonalPage = () => {
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
                <VolunteerHeaderCard id={id} volunteer={mockedVolunteerData} />
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
                <VolunteerPageContent id={id} />
            </div>
            <Footer />
        </div>
    );
};
