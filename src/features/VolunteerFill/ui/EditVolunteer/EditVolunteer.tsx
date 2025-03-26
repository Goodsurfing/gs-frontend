import React, { FC, memo } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import { getVolunteerSkillsPageUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";

interface EditVolunteerProps {
    className?: string;
}

export const EditVolunteer: FC<EditVolunteerProps> = memo(
    (props: EditVolunteerProps) => {
        const { className } = props;
        const { t } = useTranslation("volunteer");
        const navigate = useNavigate();
        const { locale } = useLocale();

        const onEditClick = () => {
            navigate(getVolunteerSkillsPageUrl(locale));
        };

        return (
            <Button
                className={className}
                onClick={onEditClick}
                color="GREEN"
                size="SMALL"
                variant="FILL"
            >
                {t("volunteer-dashboard.Редактировать профиль")}
            </Button>
        );
    },
);
