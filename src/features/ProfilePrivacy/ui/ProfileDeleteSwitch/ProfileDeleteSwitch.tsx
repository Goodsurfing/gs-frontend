import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button/Button";

interface ProfileDeleteSwitchProps {
    className?: string;
}

export const ProfileDeleteSwitch: FC<ProfileDeleteSwitchProps> = memo(
    (props: ProfileDeleteSwitchProps) => {
        const { className } = props;
        const { t } = useTranslation("profile");

        return (
            <Button
                className={className}
                color="BLUE"
                variant="FILL"
                size="SMALL"
            >
                {t("privacy.Удалить аккаунт")}
            </Button>
        );
    },
);
