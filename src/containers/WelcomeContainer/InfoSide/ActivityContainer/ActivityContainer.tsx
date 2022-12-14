import React, { FC } from "react";

import { ActivityData } from "@/containers/WelcomeContainer/InfoSide/ActivityContainer/Activity.data";
import ActivityItem from "@/containers/WelcomeContainer/InfoSide/ActivityContainer/ActivityItem/ActivityItem";

import styles from "./ActivityContainer.module.scss";

const ActivityContainer: FC = () => {
    return (
        <div className={styles.wrapper}>
            {ActivityData.map((item, index) => {
                return (
                    <ActivityItem
                        title={item.title}
                        image={item.image}
                        path={item.path}
                        key={index}
                    />
                );
            })}
        </div>
    );
};

export default ActivityContainer;
