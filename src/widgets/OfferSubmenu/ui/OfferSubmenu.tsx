import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Submenu } from "@/widgets/Submenu";

import { Offer } from "@/entities/Offer";

import { getMessengerPageCreateUrl, getOffersWherePageUrl } from "@/shared/config/routes/AppUrls";
import { useTranslateSubmenu } from "@/shared/hooks/useTranslateSubmenu";
import Button from "@/shared/ui/Button/Button";

import styles from "./OfferSubmenu.module.scss";

interface OfferSubmenuProps {
    offerData: Offer;
}

export const OfferSubmenu: FC<OfferSubmenuProps> = (props) => {
    const { offerData } = props;
    const { id, canEdit, canParticipate } = offerData;
    const { t } = useTranslation("offer");
    const { SubmenuItemsOffer } = useTranslateSubmenu();
    const navigate = useNavigate();
    const { locale } = useLocale();

    const handleParticipateClick = useCallback(() => {
        navigate(getMessengerPageCreateUrl(locale, "create", id.toString()));
    }, [id, locale, navigate]);

    const handleEditClick = useCallback(() => {
        if (canEdit) {
            navigate(getOffersWherePageUrl(locale, id.toString()));
        }
    }, [canEdit, id, locale, navigate]);

    return (
        <Submenu
            className={styles.navMenu}
            items={SubmenuItemsOffer}
            buttons={(
                <>
                    <Button
                        disabled={!canParticipate}
                        size="SMALL"
                        color="BLUE"
                        variant="FILL"
                        className={styles.button}
                        onClick={handleParticipateClick}
                    >
                        {t("personalOffer.Участвовать")}
                    </Button>
                    {canEdit && (
                        <Button
                            disabled={!canEdit}
                            size="SMALL"
                            color="BLUE"
                            variant="OUTLINE"
                            className={styles.button}
                            onClick={handleEditClick}
                        >
                            {t("personalOffer.Редактировать")}
                        </Button>
                    )}
                </>
            )}
        />
    );
};
