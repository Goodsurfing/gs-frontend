import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Submenu } from "@/widgets/Submenu";

import {
    getDonationPersonalPage, getProfileRolePageUrl, getSignInPageUrl,
} from "@/shared/config/routes/AppUrls";
import Button, { ButtonColor, ButtonSize, ButtonVariant } from "@/shared/ui/Button/Button";

import { useAppSelector } from "@/shared/hooks/redux";
import { getUserAuthData } from "@/entities/User";
import { GetDonation } from "@/entities/Donation";
import { useTranslateDonationSubmenu } from "@/shared/hooks/useTranslateDonationSubmenu";
import styles from "./DonationSubmenu.module.scss";

interface DonationSubmenuProps {
    donationData: GetDonation;
    isVolunteer: boolean;
}

export const DonationSubmenu: FC<DonationSubmenuProps> = (props) => {
    const { donationData, isVolunteer } = props;
    const { id, isCanEdit, isCanSupport } = donationData;
    const { t } = useTranslation("donation");
    const { SubmenuItemsDonation } = useTranslateDonationSubmenu();
    const navigate = useNavigate();
    const { locale } = useLocale();
    const isAuth = useAppSelector(getUserAuthData);
    const isNeedToBecomeVolunteer = !!isAuth && !isVolunteer;

    const handleParticipateClick = useCallback(() => {
        if (isNeedToBecomeVolunteer) {
            navigate(`${getProfileRolePageUrl(locale)}?nextDonation=${id}`);
        } else if (isAuth) {
            navigate(getDonationPersonalPage(locale, id));
        } else {
            navigate(`${getSignInPageUrl(locale)}?next=donation&nextId=${id}`);
        }
    }, [id, isNeedToBecomeVolunteer, locale, navigate, isAuth]);

    const handleEditClick = useCallback(() => {
        if (isCanEdit) {
            navigate(getDonationPersonalPage(locale, id));
        }
    }, [id, isCanEdit, locale, navigate]);

    const getButtonText = (): string => {
        if (isNeedToBecomeVolunteer) {
            return t("donationPersonal.Чтобы участвовать, станьте гудсёрфером");
        }

        return t("donationPersonal.Поддержать");
    };

    const buttonProps = {
        size: "SMALL" as ButtonSize,
        variant: "FILL" as ButtonVariant,
        color: "BLUE" as ButtonColor,
        onClick: handleParticipateClick,
        // disabled: isNeedToBecomeVolunteer ? false : !canParticipate,
        disabled: isAuth && !isNeedToBecomeVolunteer && !isCanSupport,
    };

    const buttonText = getButtonText();

    return (
        <Submenu
            className={styles.navMenu}
            items={SubmenuItemsDonation}
            buttons={(
                <>
                    <Button {...buttonProps}>
                        {buttonText}
                    </Button>
                    {isCanEdit && (
                        <Button
                            disabled={!isCanEdit}
                            size="SMALL"
                            color="BLUE"
                            variant="OUTLINE"
                            className={styles.button}
                            onClick={handleEditClick}
                        >
                            {t("donationPersonal.Редактировать")}
                        </Button>
                    )}
                </>
            )}
        />
    );
};
