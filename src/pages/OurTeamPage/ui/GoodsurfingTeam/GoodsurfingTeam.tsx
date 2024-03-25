import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { goodSurfingData } from "../../model/data/ourTeam";
import { TeamItem } from "../TeamItem/TeamItem";
import styles from "./GoodsurfingTeam.module.scss";

interface GoodsurfingTeamProps {
    className?: string;
}

export const GoodsurfingTeam: FC<GoodsurfingTeamProps> = memo((props: GoodsurfingTeamProps) => {
    const { className } = props;
    const renderItems = useMemo(
        () => goodSurfingData.map((item, index) => (
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
            <h2 className={styles.title}>Команда Гудсёрфинга</h2>
            <div className={styles.container}>{renderItems}</div>
        </section>
    );
});
