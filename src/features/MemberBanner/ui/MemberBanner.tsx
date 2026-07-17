import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import Button from "@/shared/ui/Button/Button";
import banner from "@/shared/assets/images/member-banner/banner.png";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./MemberBanner.module.scss";

interface MemberBannerProps {
    className?: string;
    title?: string;
    buttonText?: string;
    anchor?: string;
}

export const MemberBanner: FC<MemberBannerProps> = memo((props: MemberBannerProps) => {
    const {
        className, title, buttonText, anchor,
    } = props;
    const { t } = useTranslation("volunteer");
    const navigate = useNavigate();
    const { locale } = useLocale();

    const handleClick = () => {
        const url = getMembershipPageUrl(locale);
        navigate(anchor ? `${url}#${anchor}` : url);
    };
    return (
        <div className={cn(styles.wrapper, className)} style={{ backgroundImage: `url(${banner})` }}>
            <h3 className={styles.title}>
                {title ?? t("volunteer-dashboard.Оформи членство Гудсёрфинга и открой для себя бескрайний мир путешествий со смыслом!")}
            </h3>
            <Button color="BLUE" size="SMALL" variant="FILL" onClick={handleClick} className={styles.button}>
                {buttonText ?? t("volunteer-dashboard.Получить членство")}
            </Button>
        </div>
    );
});
