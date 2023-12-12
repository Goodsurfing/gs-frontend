import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { Profile } from "@/entities/Profile";
import { VolunteerSubscriberCard } from "@/entities/Volunteer";

import styles from "./SubscribersWidget.module.scss";

interface SubscribersWidgetProps {
    subscribers?: Profile[];
    className?: string;
}

export const SubscribersWidget: FC<SubscribersWidgetProps> = memo(
    (props: SubscribersWidgetProps) => {
        const { subscribers, className } = props;

        const renderCards = useMemo(
            () => subscribers?.map((subscriber, index) => (
                <VolunteerSubscriberCard
                    className={styles.card}
                    profile={subscriber}
                    key={index}
                />
            )),
            [subscribers],
        );

        if (!subscribers) {
            return (
                <div className={styles.emptyWrapper}>
                    <h2>На данный момент у вас нет подпсичсиков</h2>
                </div>
            );
        }

        return (
            <div className={cn(className, styles.wrapper)}>
                {renderCards}
            </div>
        );
    },
);
