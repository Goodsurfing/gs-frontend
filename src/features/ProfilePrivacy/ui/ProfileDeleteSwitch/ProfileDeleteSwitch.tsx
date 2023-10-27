import React, { FC } from "react";

import Button from "@/shared/ui/Button/Button";

interface ProfileDeleteProps {
    className?: string;
}

export const ProfileDelete: FC<ProfileDeleteProps> = ({ className }) => (
    <Button className={className} color="BLUE" variant="FILL" size="SMALL">
        Удалить аккаунт
    </Button>
);
