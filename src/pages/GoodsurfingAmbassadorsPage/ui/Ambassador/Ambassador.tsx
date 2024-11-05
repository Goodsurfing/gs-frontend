import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { ambassadorsData } from "../../model/data/ambassadors";
import { TeamItem } from "../TeamItem/TeamItem";
import styles from "./Ambassador.module.scss";

interface AmbassadorProps {
    className?: string;
}

export const Ambassador: FC<AmbassadorProps> = memo((props: AmbassadorProps) => {
    const { className } = props;
    const renderItems = useMemo(
        () => ambassadorsData.map((item, index) => (
            <TeamItem
                image={item.image}
                name={item.name}
                description={item.description}
                address={item.description}
                key={index}
            />
        )),
        [],
    );
    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>Наши Амбассадоры</h2>
            <div className={styles.container}>{renderItems}</div>
        </section>
    );
});
