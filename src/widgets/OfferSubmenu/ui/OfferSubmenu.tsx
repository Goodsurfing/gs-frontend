import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "./OfferSubmenu.module.scss";
import { Submenu } from "@/widgets/Submenu";
import Button from "@/shared/ui/Button/Button";
import { useTranslateSubmenu } from "@/shared/hooks/useTranslateSubmenu";
import { getMessengerPageCreateUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface OfferSubmenuProps {
    id?: string;
}

export const OfferSubmenu: FC<OfferSubmenuProps> = (props) => {
    const { id } = props;
    const { t } = useTranslation("offer");
    const { SubmenuItemsOffer } = useTranslateSubmenu();
    const navigate = useNavigate();
    const { locale } = useLocale();

    const navigateTo = () => {
        navigate(getMessengerPageCreateUrl(locale, "create", id));
    };

    return (
        <Submenu
            className={styles.navMenu}
            items={SubmenuItemsOffer}
            buttons={(
                <Button
                    size="SMALL"
                    color="BLUE"
                    variant="FILL"
                    className={styles.button}
                    onClick={navigateTo}
                >
                    {t("personalOffer.Участвовать")}
                </Button>
            )}
        />
    );
};
