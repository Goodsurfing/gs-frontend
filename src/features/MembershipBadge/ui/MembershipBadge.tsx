import cn from "classnames";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import styles from "./MembershipBadge.module.scss";

interface MembershipBadgeProps {
    variant: "volunteer" | "host";
    className?: string;
}

/**
 * GS-28: текстовый значок членства — «Член сообщества» у волонтёра,
 * «Партнёр Гудсёрфинга» у организатора. Отдельно от MembershipVerifiedBadge
 * (GS-150) — та иконка с тултипом объясняет, что значит галочка, этот
 * компонент — короткая подпись рядом с именем в карточках/списках.
 */
export const MembershipBadge: FC<MembershipBadgeProps> = memo((props: MembershipBadgeProps) => {
    const { variant, className } = props;
    const { t } = useTranslation();

    const text = variant === "host"
        ? t("membershipBadge.Партнёр Гудсёрфинга")
        : t("membershipBadge.Член сообщества");

    return (
        <span className={cn(styles.badge, className)}>
            {text}
        </span>
    );
});
