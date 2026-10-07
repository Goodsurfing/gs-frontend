import cn from "classnames";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetProfileOccupancyQuery } from "@/entities/Profile";
import { getUserAuthData } from "@/entities/User";
import { useAppSelector } from "@/shared/hooks/redux";
import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import { FREE_APPLICATIONS_LIMIT } from "@/shared/constants/membership";
import LocaleLink from "@/shared/ui/LocaleLink/LocaleLink";

import styles from "./FreeApplicationsCounter.module.scss";

interface FreeApplicationsCounterProps {
    className?: string;
}

/**
 * GS-171: остаток бесплатных откликов — тот же источник данных
 * (profile/occupancy.remainingFreeApplications), что и блокировка кнопки
 * «Участвовать» в GS-169, показывается заранее на /offers-map и дашборде
 * волонтёра, а не только в момент отклика.
 */
export const FreeApplicationsCounter: FC<FreeApplicationsCounterProps> = memo((
    props: FreeApplicationsCounterProps,
) => {
    const { className } = props;
    const isAuth = useAppSelector(getUserAuthData);
    const { data: profileOccupancy } = useGetProfileOccupancyQuery(undefined, { skip: !isAuth });
    const { t } = useTranslation();
    const { locale } = useLocale();

    if (!isAuth || !profileOccupancy) {
        return null;
    }

    const { isMembership, remainingFreeApplications } = profileOccupancy;

    return (
        <div className={cn(styles.wrapper, className)}>
            {isMembership ? (
                <>
                    <span className={styles.value}>&#8734;</span>
                    <LocaleLink to={getMembershipPageUrl(locale)} className={styles.hint}>
                        {t("freeApplicationsCounter.Не забудьте продлить членство, чтобы сохранить привилегии")}
                    </LocaleLink>
                </>
            ) : (
                <>
                    <span className={styles.value}>
                        {t("freeApplicationsCounter.Можно бесплатно откликнуться на:")}
                        {" "}
                        {remainingFreeApplications ?? 0}
                        /
                        {FREE_APPLICATIONS_LIMIT}
                    </span>
                    <LocaleLink to={getMembershipPageUrl(locale)} className={styles.hint}>
                        {t("freeApplicationsCounter.Нужно больше? Оформите членство!")}
                    </LocaleLink>
                </>
            )}
        </div>
    );
});
