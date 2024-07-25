import React, { FC } from "react";
import styles from "./OfferSubmenu.module.scss";
import { Submenu } from "@/widgets/Submenu";
import Button from "@/shared/ui/Button/Button";
import { SubmenuItems } from "../model/data/submenuData";

interface OfferSubmenuProps {
    offerId?: string;
}

export const OfferSubmenu: FC<OfferSubmenuProps> = (props) => {
    const { offerId } = props;
    return (
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
    );
};
