import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";

import { ShareBlock } from "@/shared/ui/ShareBlock/ShareBlock";

interface ArticleShareProps {
    className?: string;
    url: string;
}

export const ArticleShare: FC<ArticleShareProps> = memo((props: ArticleShareProps) => {
    const { className, url } = props;
    const { t } = useTranslation();

    return (
        <ShareBlock
            className={className}
            label={t("Поделиться")}
            textTitle="Статья"
            url={url}
        />
    );
});
