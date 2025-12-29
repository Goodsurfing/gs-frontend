import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button/Button";

interface ProfileDeleteSwitchProps {
    className?: string;
    onClick?: () => void;
}

export const ProfileDeleteSwitch: FC<ProfileDeleteSwitchProps> = memo(
    (props: ProfileDeleteSwitchProps) => {
        const { className, onClick } = props;
        const { t } = useTranslation("profile");

        return (
            <Button
                className={className}
                color="BLUE"
                variant="FILL"
                size="SMALL"
                onClick={onClick}
            >
                {t("privacy.Удалить аккаунт")}
            </Button>
        );
    },
);
