import cn from "classnames";
import React, {
    FC, memo, useCallback, useMemo,
    useState,
} from "react";
import { useTranslation } from "react-i18next";

import { TeamCard } from "@/features/TeamForm/ui/TeamCard/TeamCard";

import { useGetHostMembersByIdQuery } from "../../api/hostApi";
import styles from "./HostTeamCard.module.scss";
import { Text } from "@/shared/ui/Text/Text";
import { useLocale } from "@/app/providers/LocaleProvider";
import { ShowNext } from "@/shared/ui/ShowNext/ShowNext";

interface HostTeamCardProps {
    hostId: string;
    className?: string;
}

const VISIBLE_COUNT = 6;

export const HostTeamCard: FC<HostTeamCardProps> = memo(
    (props: HostTeamCardProps) => {
        const { hostId, className } = props;
        const { t } = useTranslation("host");
        const { data: hostMembers, isError } = useGetHostMembersByIdQuery(hostId);
        const { locale } = useLocale();

        const [visibleCount, setVisibleCount] = useState<number>(VISIBLE_COUNT);

        const handleShowNext = useCallback(() => {
            setVisibleCount((prev) => prev + VISIBLE_COUNT);
        }, []);

        const renderCard = useMemo(() => {
            if (!hostMembers) return null;
            return hostMembers.slice(0, visibleCount).map((user) => (
                <TeamCard teamUser={user} disableDeleteIcn key={user.id} locale={locale} />
            ));
        }, [hostMembers, locale, visibleCount]);

        if (!hostMembers || isError || hostMembers.length === 0) {
            return null;
        }

        return (
            <div id="5" className={cn(className, styles.wrapper)}>
                <Text title={t("personalHost.Команда")} titleSize="h3" />
                <div className={styles.container}>{renderCard}</div>
                {(visibleCount < hostMembers.length) && <ShowNext onClick={handleShowNext} />}
            </div>
        );
    },
);
