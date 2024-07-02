import React from "react";
import { useParams } from "react-router-dom";

import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Submenu } from "@/widgets/Submenu";

import { Text } from "@/shared/ui/Text/Text";

import { mockedHostData } from "@/entities/Host/model/data/mockedHostData";
import { SubmenuItems } from "../../model/data/submenuData";
import { HostlHeaderCard } from "../HostlHeaderCard/HostlHeaderCard";
import styles from "./HostPersonalPage.module.scss";
import { HostPageContent } from "../HostPageContent/HostPageContent";
import Button from "@/shared/ui/Button/Button";

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
                <Submenu
                    className={styles.navMenu}
                    items={SubmenuItems}
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
                <HostPageContent id={id} />
            </div>
            <Footer />
        </div>
    );
};
