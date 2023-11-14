import React, { FC, memo } from "react";

import Button from "@/shared/ui/Button/Button";

interface ProfileDeleteSwitchProps {
    className?: string;
}

export const ProfileDeleteSwitch: FC<ProfileDeleteSwitchProps> = memo(
    (props: ProfileDeleteSwitchProps) => {
        const { className } = props;
        return (
            <Button
                className={className}
                color="BLUE"
                variant="FILL"
                size="SMALL"
            >
                Удалить аккаунт
            </Button>
        );
    },
);
