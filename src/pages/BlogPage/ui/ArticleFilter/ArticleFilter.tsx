import React, { FC } from "react";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Filter } from "@/features/Article";
import Button from "@/shared/ui/Button/Button";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getVolunteerGalleryPageUrl } from "@/shared/config/routes/AppUrls";

interface FilterProps {
    className?: string;
}

export const ArticleFilter: FC<FilterProps> = (props) => {
    const { className } = props;
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { t } = useTranslation("blog");

    const onAddArticleClick = () => {
        navigate(getVolunteerGalleryPageUrl(locale));
    };

    return (
        <div className={cn(className)}>
            <Filter />
            <Button color="GREEN" variant="FILL" size="SMALL" onClick={onAddArticleClick}>{t("Добавить статью")}</Button>
        </div>
    );
};
