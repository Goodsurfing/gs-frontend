import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import { getBlogPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { ShareBlock } from "@/shared/ui/ShareBlock/ShareBlock";

interface ArticleShareProps {
    className?: string;
}

export const ArticleShare: FC<ArticleShareProps> = memo((props: ArticleShareProps) => {
    const { locale } = useLocale();
    const { className } = props;
    const { t } = useTranslation();

    return (
        <ShareBlock
            className={className}
            label={t("Поделиться")}
            textTitle="Статья"
            url={getBlogPersonalPageUrl(locale)}
        />
    );
});
