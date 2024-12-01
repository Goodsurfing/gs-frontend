import React, { FC, memo } from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getBlogPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { ShareBlock } from "@/shared/ui/ShareBlock/ShareBlock";

interface ArticleShareProps {
    className?: string;
}

export const ArticleShare: FC<ArticleShareProps> = memo((props: ArticleShareProps) => {
    const { locale } = useLocale();
    const { className } = props;
    return (
        <ShareBlock
            className={className}
            label="Поделиться"
            textTitle="Статья"
            url={getBlogPersonalPageUrl(locale)}
        />
    );
});
