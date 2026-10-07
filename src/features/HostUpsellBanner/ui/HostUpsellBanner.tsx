import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { useGetMyHostQuery } from "@/entities/Host";
import { useGetProfileOccupancyQuery } from "@/entities/Profile";
import { MemberBanner } from "@/features/MemberBanner";

import styles from "./HostUpsellBanner.module.scss";

/** Срок ответа не подтверждён бизнесом — в черновике документа было
 * "14 рабочих дней" как пример, не финальное значение (GS-151). */
const RESPONSE_DAYS = 14;

interface HostUpsellBannerProps {
    kind: "consultation" | "mediaSupport";
    className?: string;
}

/**
 * GS-151: два баннера допродажи для организаторов (/host/info —
 * консультация по продвижению, /host/my-offers — медиаподдержка).
 * Без членства — предложение оформить (MemberBanner), с членством —
 * инструкция написать на поддержку с готовой темой письма.
 */
export const HostUpsellBanner: FC<HostUpsellBannerProps> = memo((props: HostUpsellBannerProps) => {
    const { kind, className } = props;
    const { t } = useTranslation("host");
    const { data: profileOccupancy } = useGetProfileOccupancyQuery();
    const { data: host } = useGetMyHostQuery();

    if (!profileOccupancy) {
        return null;
    }

    const subjectPrefix = kind === "consultation"
        ? t("hostUpsellBanner.Консультация по продвижению")
        : t("hostUpsellBanner.Медиаподдержка");
    const subject = `${subjectPrefix} - ${host?.name ?? ""}`;
    const mailtoHref = `mailto:support@goodsurfing.org?subject=${encodeURIComponent(subject)}`;

    if (!profileOccupancy.isMembership) {
        const title = kind === "consultation"
            ? t("hostUpsellBanner.Организаторы с оформленным членством могут получить бесплатную консультацию по продвижению своего проекта")
            : t("hostUpsellBanner.Организаторы с оформленным членством получают медиаподдержку своего проекта");

        return (
            <MemberBanner className={className} title={title} anchor="host" />
        );
    }

    return (
        <div className={className ? `${styles.wrapper} ${className}` : styles.wrapper}>
            <p className={styles.text}>
                {kind === "consultation"
                    ? t("hostUpsellBanner.Вы можете получить консультацию по продвижению")
                    : t("hostUpsellBanner.Вы можете получить медиаподдержку проекта")}
                {" "}
                <a className={styles.link} href={mailtoHref}>
                    support@goodsurfing.org
                </a>
                {" "}
                {t("hostUpsellBanner.с темой письма")}
                {" «"}
                {subject}
                {"», "}
                {t("hostUpsellBanner.ответ в течение {{days}} рабочих дней", { days: RESPONSE_DAYS })}
            </p>
        </div>
    );
});
