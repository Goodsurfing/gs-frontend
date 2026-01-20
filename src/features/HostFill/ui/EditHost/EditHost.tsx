import { memo } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { getHostInfoUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";
import { useLocale } from "@/app/providers/LocaleProvider";

interface EditHostProps {
    className?: string;
}

export const EditHost = memo((props: EditHostProps) => {
    const { className } = props;
    const navigate = useNavigate();
    const { locale } = useLocale();
    const { t } = useTranslation("host");
    const onEditClick = () => {
        navigate(getHostInfoUrl(locale));
    };
    return (
        <Button
            className={className}
            onClick={onEditClick}
            color="GREEN"
            size="SMALL"
            variant="FILL"
        >
            {t("host-dashboard.Редактировать профиль")}
        </Button>
    );
});
