import cn from "classnames";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetCurrentMembershipQuery } from "@/store/api/membershipApi";
import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import { formatDate } from "@/shared/lib/formatDate";
import { TARIFF_FALLBACK_PRICE_RUB, TARIFF_CODE } from "@/shared/constants/membership";
import Button from "@/shared/ui/Button/Button";

import styles from "./ProfileMembershipBanner.module.scss";

interface ProfileMembershipBannerProps {
    className?: string;
}

/**
 * GS-170: баннер на /profile/info. Без членства — две колонки (волонтёр
 * 990₽ / организатор 4990₽), с активным — информационное "активно до" +
 * "Продлить членство". Переход на renewal ведёт на /membership с якорем,
 * соответствующим купленному тарифу (programmatic preselect конкретного
 * тарифа на /membership не поддерживается текущей инфраструктурой
 * checkout — см. обсуждение в PR).
 */
export const ProfileMembershipBanner: FC<ProfileMembershipBannerProps> = memo((
    props: ProfileMembershipBannerProps,
) => {
    const { className } = props;
    const { t } = useTranslation("profile");
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { data: membership } = useGetCurrentMembershipQuery();

    const goToMembership = (anchor?: "host") => {
        const url = getMembershipPageUrl(locale);
        navigate(anchor ? `${url}#${anchor}` : url);
    };

    if (membership?.isActive) {
        const isHostTariff = membership.tariff?.forRole === "HOST";

        return (
            <div className={cn(styles.wrapper, styles.active, className)}>
                <p className={styles.activeText}>
                    {t("info.Членство активно до {{date}}", { date: formatDate(locale, membership.endDate) })}
                </p>
                <Button
                    color="BLUE"
                    size="SMALL"
                    variant="FILL"
                    onClick={() => goToMembership(isHostTariff ? "host" : undefined)}
                >
                    {t("info.Продлить членство")}
                </Button>
            </div>
        );
    }

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={cn(styles.column, styles.columnVolunteer)}>
                <span className={styles.columnLabel}>{t("info.Волонтёрам")}</span>
                <p className={styles.columnText}>
                    {t(
                        "info.Получи возможность оставлять неограниченное количество откликов и путешествовать без лимитов — {{price}} руб/год",
                        { price: TARIFF_FALLBACK_PRICE_RUB[TARIFF_CODE.VOLUNTEER] },
                    )}
                </p>
                <Button color="BLUE" size="SMALL" variant="FILL" onClick={() => goToMembership()}>
                    {t("info.Оформить членство")}
                </Button>
            </div>
            <div className={cn(styles.column, styles.columnHost)}>
                <span className={styles.columnLabel}>{t("info.Организаторам")}</span>
                <p className={styles.columnText}>
                    {t(
                        "info.Создавай неограниченное количество вакансий и получи больше возможностей для своего проекта — {{price}} руб/год",
                        { price: TARIFF_FALLBACK_PRICE_RUB[TARIFF_CODE.HOST] },
                    )}
                </p>
                <Button color="GREEN" size="SMALL" variant="FILL" onClick={() => goToMembership("host")}>
                    {t("info.Оформить членство")}
                </Button>
            </div>
        </div>
    );
});
