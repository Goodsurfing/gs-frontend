import cn from "classnames";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import styles from "./MembershipBadge.module.scss";

interface MembershipBadgeProps {
    variant: "volunteer" | "host" | "international";
    className?: string;
}

/**
 * GS-28: текстовый значок членства — «Член сообщества» у волонтёра,
 * «Партнёр Гудсёрфинга» у организатора. Отдельно от MembershipVerifiedBadge
 * (GS-150) — та иконка с тултипом объясняет, что значит галочка, этот
 * компонент — короткая подпись рядом с именем в карточках/списках.
 * «Международный клуб» — отдельный синий значок участника Международного
 * клуба (платформенных прав не даёт, ставится рядом с «Членом сообщества»).
 */
export const MembershipBadge: FC<MembershipBadgeProps> = memo((props: MembershipBadgeProps) => {
    const { variant, className } = props;
    const { t } = useTranslation();

    const texts = {
        host: t("membershipBadge.Партнёр Гудсёрфинга"),
        volunteer: t("membershipBadge.Член сообщества"),
        international: t("membershipBadge.Международный клуб"),
    };
    const text = texts[variant];

    return (
        <span className={cn(styles.badge, variant === "international" && styles.international, className)}>
            {text}
        </span>
    );
});
