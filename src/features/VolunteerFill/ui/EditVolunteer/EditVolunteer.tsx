import React, { FC, memo } from "react";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";

interface EditVolunteerProps {
    className?: string;
}

export const EditVolunteer: FC<EditVolunteerProps> = memo(
    (props: EditVolunteerProps) => {
        const { className } = props;
        const navigate = useNavigate();
        const { locale } = useLocale();
        const onEditClick = () => {
            navigate(getMainPageUrl(locale));
        };

        return (
            <Button
                className={className}
                onClick={onEditClick}
                color="GREEN"
                size="SMALL"
                variant="FILL"
            >
                Редактировать профиль
            </Button>
        );
    },
);
