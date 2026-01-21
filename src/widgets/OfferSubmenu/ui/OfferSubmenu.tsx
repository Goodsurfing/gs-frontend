import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Submenu } from "@/widgets/Submenu";

import { Offer } from "@/entities/Offer";

import {
    getMessengerPageCreateUrl, getOffersWherePageUrl, getProfileRolePageUrl, getSignInPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useTranslateSubmenu } from "@/shared/hooks/useTranslateSubmenu";
import Button, { ButtonColor, ButtonSize, ButtonVariant } from "@/shared/ui/Button/Button";

import styles from "./OfferSubmenu.module.scss";
import { useAppSelector } from "@/shared/hooks/redux";
import { getUserAuthData } from "@/entities/User";

interface OfferSubmenuProps {
    offerData: Offer;
    isVolunteer: boolean;
}

export const OfferSubmenu: FC<OfferSubmenuProps> = (props) => {
    const { offerData, isVolunteer } = props;
    const { id, canEdit, canParticipate } = offerData;
    const { t } = useTranslation("offer");
    const { SubmenuItemsOffer, textParticipateLib } = useTranslateSubmenu();
    const navigate = useNavigate();
    const { locale } = useLocale();
    const isAuth = useAppSelector(getUserAuthData);
    const isNeedToBecomeVolunteer = !!isAuth && !isVolunteer;

    const handleParticipateClick = useCallback(() => {
        if (isNeedToBecomeVolunteer) {
            navigate(`${getProfileRolePageUrl(locale)}?next=${id.toString()}`);
        } else if (isAuth) {
            navigate(getMessengerPageCreateUrl(locale, "create", id.toString()));
        } else {
            navigate(`${getSignInPageUrl(locale)}?next=offer&nextId=${id.toString()}`);
        }
    }, [id, isNeedToBecomeVolunteer, locale, navigate, isAuth]);

    const handleEditClick = useCallback(() => {
        if (canEdit) {
            navigate(getOffersWherePageUrl(locale, id.toString()));
        }
    }, [canEdit, id, locale, navigate]);

    const getButtonText = (): string => {
        if (isNeedToBecomeVolunteer) {
            return t("personalOffer.Чтобы участвовать, станьте гудсёрфером");
        }

        if (offerData.textParticipate
            && textParticipateLib[offerData.textParticipate as keyof typeof textParticipateLib]) {
            return textParticipateLib[offerData.textParticipate as keyof typeof textParticipateLib];
        }

        return t("personalOffer.Участвовать");
    };

    const buttonProps = {
        size: "SMALL" as ButtonSize,
        variant: "FILL" as ButtonVariant,
        color: "BLUE" as ButtonColor,
        onClick: handleParticipateClick,
        // disabled: isNeedToBecomeVolunteer ? false : !canParticipate,
        disabled: isAuth && !isNeedToBecomeVolunteer && !canParticipate,
    };

    const buttonText = getButtonText();

    return (
        <Submenu
            className={styles.navMenu}
            items={SubmenuItemsOffer}
            buttons={(
                <>
                    <Button {...buttonProps}>
                        {buttonText}
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
