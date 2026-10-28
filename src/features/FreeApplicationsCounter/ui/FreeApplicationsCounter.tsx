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
import { QuotaDiagram } from "@/shared/ui/QuotaDiagram/QuotaDiagram";

import styles from "./FreeApplicationsCounter.module.scss";

interface FreeApplicationsCounterProps {
    className?: string;
    /** GS-188: column — на дашборде рядом с диаграммой заполненности, row — в полосе фильтров. */
    layout?: "column" | "row";
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
    const { className, layout = "column" } = props;
    const isAuth = useAppSelector(getUserAuthData);
    const { data: profileOccupancy } = useGetProfileOccupancyQuery(undefined, { skip: !isAuth });
    const { t } = useTranslation();
    const { locale } = useLocale();

    if (!isAuth || !profileOccupancy) {
        return null;
    }

    const { isMembership, remainingFreeApplications } = profileOccupancy;

    return (
        <QuotaDiagram
            className={cn(styles.wrapper, className)}
            layout={layout}
            size={layout === "row" ? 64 : 110}
            remaining={isMembership ? null : (remainingFreeApplications ?? 0)}
            limit={FREE_APPLICATIONS_LIMIT}
            label={isMembership
                ? t("freeApplicationsCounter.Без ограничений")
                : t("freeApplicationsCounter.Откликов осталось")}
            hint={(
                <LocaleLink to={getMembershipPageUrl(locale)} className={styles.hint}>
                    {isMembership
                        ? t("freeApplicationsCounter.Не забудьте продлить членство, чтобы сохранить привилегии")
                        : t("freeApplicationsCounter.Нужно больше? Оформите членство!")}
                </LocaleLink>
            )}
        />
    );
});
