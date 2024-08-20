import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import styles from "./OfferSubmenu.module.scss";
import { Submenu } from "@/widgets/Submenu";
import Button from "@/shared/ui/Button/Button";
import { useTranslateSubmenu } from "@/shared/hooks/useTranslateSubmenu";

interface OfferSubmenuProps {
    id?: string;
}

export const OfferSubmenu: FC<OfferSubmenuProps> = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id } = props;
    const { t } = useTranslation("offer");
    const { SubmenuItemsOffer } = useTranslateSubmenu();
    return (
        <Submenu
            className={styles.navMenu}
            items={SubmenuItemsOffer}
            buttons={(
                <>
                    <Button
                        size="SMALL"
                        color="BLUE"
                        variant="OUTLINE"
                        className={styles.button}
                    >
                        {t("personalOffer.Написать")}
                    </Button>
                    <Button
                        size="SMALL"
                        color="BLUE"
                        variant="FILL"
                        className={styles.button}
                    >
                        {t("personalOffer.Участвовать")}
                    </Button>
                </>
            )}
        />
    );
};
