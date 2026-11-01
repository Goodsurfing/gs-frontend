import cn from "classnames";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import { hasHostMembership, useGetProfileOccupancyQuery } from "@/entities/Profile";
import { getUserAuthData } from "@/entities/User";
import { useAppSelector } from "@/shared/hooks/redux";
import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import { FREE_VACANCIES_LIMIT } from "@/shared/constants/membership";
import LocaleLink from "@/shared/ui/LocaleLink/LocaleLink";
import { QuotaDiagram } from "@/shared/ui/QuotaDiagram/QuotaDiagram";

import styles from "./PublishedVacanciesCounter.module.scss";

interface PublishedVacanciesCounterProps {
    className?: string;
    /** GS-188: column — на дашборде рядом с диаграммой заполненности, row — в полосе фильтров. */
    layout?: "column" | "row";
}

/**
 * GS-172: остаток бесплатных опубликованных вакансий хоста — тот же
 * источник данных (profile/occupancy.remainingFreeVacancies), что и лимит,
 * который уже применяется на бэкенде при публикации (ToggleStatusHandler),
 * но до этого был виден хосту только в момент ошибки. С активным членством
 * remainingFreeVacancies всегда null независимо от роли, поэтому этот
 * компонент предполагает хост-гейтед страницу (/host/host-dashboard) —
 * на странице без такой гарантии "∞" мог бы показаться волонтёру.
 */
export const PublishedVacanciesCounter: FC<PublishedVacanciesCounterProps> = memo((
    props: PublishedVacanciesCounterProps,
) => {
    const { className, layout = "column" } = props;
    const isAuth = useAppSelector(getUserAuthData);
    const { data: profileOccupancy } = useGetProfileOccupancyQuery(undefined, { skip: !isAuth });
    const { t } = useTranslation();
    const { locale } = useLocale();

    if (!isAuth || !profileOccupancy) {
        return null;
    }

    const { remainingFreeVacancies } = profileOccupancy;
    // Безлимит вакансий — только у хостового членства, не у волонтёрского.
    const isHostMember = hasHostMembership(profileOccupancy);

    return (
        <QuotaDiagram
            className={cn(styles.wrapper, className)}
            layout={layout}
            size={layout === "row" ? 64 : 110}
            remaining={isHostMember ? null : (remainingFreeVacancies ?? 0)}
            limit={FREE_VACANCIES_LIMIT}
            label={isHostMember
                ? t("publishedVacanciesCounter.Без ограничений")
                : t("publishedVacanciesCounter.Вакансий осталось")}
            hint={(
                <LocaleLink to={getMembershipPageUrl(locale)} className={cn(styles.hint, { [styles.hintBlock]: layout !== "row" })}>
                    {isHostMember
                        ? t("publishedVacanciesCounter.Не забудьте продлить членство, чтобы сохранить привилегии")
                        : t("publishedVacanciesCounter.Нужно больше? Оформите членство!")}
                </LocaleLink>
            )}
        />
    );
});
