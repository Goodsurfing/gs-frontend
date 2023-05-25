import { FC } from "react";

import { ActivityData } from "widgets/WelcomeContainer/InfoSide/ActivityContainer/Activity.data";
import ActivityItem from "widgets/WelcomeContainer/InfoSide/ActivityContainer/ActivityItem/ActivityItem";

import styles from "./ActivityContainer.module.scss";

const ActivityContainer: FC = () => (
    <div className={styles.wrapper}>
        {ActivityData.map((item, index) => (
            <ActivityItem
                title={item.title}
                image={item.image}
                path={item.path}
                key={index}
            />
        ))}
    </div>
);

export default ActivityContainer;
