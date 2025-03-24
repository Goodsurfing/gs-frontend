import cn from "classnames";
import React, { FC, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TeamCard } from "@/features/TeamForm/ui/TeamCard/TeamCard";

import { useGetHostMembersByIdQuery } from "../../api/hostApi";
import styles from "./HostTeamCard.module.scss";
import { Text } from "@/shared/ui/Text/Text";
import { useLocale } from "@/app/providers/LocaleProvider";

interface HostTeamCardProps {
    hostId: string;
    className?: string;
}

export const HostTeamCard: FC<HostTeamCardProps> = memo(
    (props: HostTeamCardProps) => {
        const { hostId, className } = props;
        const { t } = useTranslation("host");
        const { data: hostMembers, isError } = useGetHostMembersByIdQuery(hostId);
        const { locale } = useLocale();

        const renderCard = useMemo(() => {
            if (!hostMembers) return null;
            return hostMembers.map((user) => (
                <TeamCard teamUser={user} disableDeleteIcn key={user.id} locale={locale} />
            ));
        }, [hostMembers, locale]);

        if (!hostMembers || isError || hostMembers.length === 0) {
            return null;
        }

        return (
            <div id="5" className={cn(className, styles.wrapper)}>
                <Text title={t("personalHost.Команда")} titleSize="h3" />
                <div className={styles.container}>{renderCard}</div>
            </div>
        );
    },
);
