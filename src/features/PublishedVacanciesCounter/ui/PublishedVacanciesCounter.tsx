import cn from "classnames";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetProfileOccupancyQuery } from "@/entities/Profile";
import { getUserAuthData } from "@/entities/User";
import { useAppSelector } from "@/shared/hooks/redux";
import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import { FREE_VACANCIES_LIMIT } from "@/shared/constants/membership";
import LocaleLink from "@/shared/ui/LocaleLink/LocaleLink";

import styles from "./PublishedVacanciesCounter.module.scss";

interface PublishedVacanciesCounterProps {
    className?: string;
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
    const { className } = props;
    const isAuth = useAppSelector(getUserAuthData);
    const { data: profileOccupancy } = useGetProfileOccupancyQuery(undefined, { skip: !isAuth });
    const { t } = useTranslation();
    const { locale } = useLocale();

    if (!isAuth || !profileOccupancy) {
        return null;
    }

    const { isMembership, remainingFreeVacancies } = profileOccupancy;

    return (
        <div className={cn(styles.wrapper, className)}>
            {isMembership ? (
                <>
                    <span className={styles.value}>&#8734;</span>
                    <LocaleLink to={getMembershipPageUrl(locale)} className={styles.hint}>
                        {t("publishedVacanciesCounter.Не забудьте продлить членство, чтобы сохранить привилегии")}
                    </LocaleLink>
                </>
            ) : (
                <>
                    <span className={styles.value}>
                        {t("publishedVacanciesCounter.Можно бесплатно опубликовать вакансий:")}
                        {" "}
                        {remainingFreeVacancies ?? 0}
                        /
                        {FREE_VACANCIES_LIMIT}
                    </span>
                    <LocaleLink to={getMembershipPageUrl(locale)} className={styles.hint}>
                        {t("publishedVacanciesCounter.Нужно больше? Оформите членство!")}
                    </LocaleLink>
                </>
            )}
        </div>
    );
});
