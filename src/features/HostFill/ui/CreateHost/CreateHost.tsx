import { memo } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { getHostRegisterPageUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";
import { useLocale } from "@/app/providers/LocaleProvider";

interface CreateHostProps {
    className?: string;
}

export const CreateHost = memo((props: CreateHostProps) => {
    const { className } = props;
    const navigate = useNavigate();
    const { locale } = useLocale();
    const { t } = useTranslation("host");
    const onCreateClick = () => {
        navigate(getHostRegisterPageUrl(locale));
    };
    return (
        <Button
            className={className}
            onClick={onCreateClick}
            color="GREEN"
            size="SMALL"
            variant="FILL"
        >
            {t("host-dashboard.Создать организацию")}
        </Button>
    );
});
