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
}

export const MemberBanner: FC<MemberBannerProps> = memo((props: MemberBannerProps) => {
    const { className } = props;
    const { t } = useTranslation("volunteer");
    const navigate = useNavigate();
    const { locale } = useLocale();

    const handleClick = () => {
        navigate(getMembershipPageUrl(locale));
    };
    return (
        <div className={cn(styles.wrapper, className)} style={{ backgroundImage: `url(${banner})` }}>
            <h3 className={styles.title}>
                {t("volunteer-dashboard.Оформи членство Гудсёрфинга и открой для себя бескрайний мир путешествий со смыслом!")}
            </h3>
            <Button color="BLUE" size="SMALL" variant="FILL" onClick={handleClick} className={styles.button}>
                {t("volunteer-dashboard.Получить членство")}
            </Button>
        </div>
    );
});
