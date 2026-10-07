import cn from "classnames";
import { FC, memo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Tooltip } from "@mui/material";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import memberIcon from "@/shared/assets/icons/select-check.svg";
import LocaleLink from "@/shared/ui/LocaleLink/LocaleLink";

import styles from "./MembershipVerifiedBadge.module.scss";

interface MembershipVerifiedBadgeProps {
    className?: string;
}

/**
 * GS-150: раньше текст сноски называл только одну роль («гудсёрфер»),
 * хотя значок стоит и у организаторов (HostlHeaderCard) — заменено на
 * «пользователь». Тултип по умолчанию открывается только на hover, что на
 * мобильных недоступно — добавлено управление через open/onClick, чтобы
 * тап по значку тоже открывал подсказку.
 */
export const MembershipVerifiedBadge: FC<MembershipVerifiedBadgeProps> = memo((
    props: MembershipVerifiedBadgeProps,
) => {
    const { className } = props;
    const { t } = useTranslation("profile");
    const { locale } = useLocale();
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    const tooltipContent = (
        <>
            {t("personal.Верифицированный пользователь. Хочешь, чтобы тебе тоже больше доверяли? Оформи членство!")}
            {" "}
            <LocaleLink to={getMembershipPageUrl(locale)} className={styles.link}>
                {t("personal.Как это сделать?")}
            </LocaleLink>
        </>
    );

    return (
        <Tooltip
            title={tooltipContent}
            open={isTooltipOpen}
            onOpen={() => setIsTooltipOpen(true)}
            onClose={() => setIsTooltipOpen(false)}
        >
            <img
                src={memberIcon}
                className={cn(styles.memberIcon, className)}
                alt="member"
                onClick={() => setIsTooltipOpen((prev) => !prev)}
            />
        </Tooltip>
    );
});
