import React, { FC } from "react";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Filter, TagsOption } from "@/features/Article";
import Button from "@/shared/ui/Button/Button";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getVolunteerCreateArticlePageUrl } from "@/shared/config/routes/AppUrls";

interface FilterProps {
    className?: string;
    value: TagsOption;
    onChange: (value: TagsOption) => void;
}

export const ArticleFilter: FC<FilterProps> = (props) => {
    const { className, value, onChange } = props;
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { t } = useTranslation("blog");

    const onAddArticleClick = () => {
        navigate(getVolunteerCreateArticlePageUrl(locale));
    };

    return (
        <div className={cn(className)}>
            <Filter value={value} onChange={onChange} />
            <Button color="GREEN" variant="FILL" size="SMALL" onClick={onAddArticleClick}>{t("Добавить статью")}</Button>
        </div>
    );
};
