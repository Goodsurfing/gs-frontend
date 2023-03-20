import React, { FC } from "react";

import DashboardDoughnut from "@/components/DashboardDoughnut/DashboardDoughnut";
import Button from "@/components/ui/Button/Button";
import { Variant } from "@/components/ui/Button/Button.interface";

import { ProfileFillItems } from "./HostProfileFill.data";
import styles from "./HostProfileFill.module.scss";

const HostProfileFill: FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.titleWrapper}>
                <h2 className={styles.title}>Заполненность аккаунта</h2>
            </div>
            <div className={styles.statsWrapper}>
                <ul className={styles.stats}>
                    {ProfileFillItems.map((item) => {
                        return (
                            <li key={item.text} className={styles.statsItem}>
                                <div
                                    style={{
                                        backgroundColor: `${
                                            item.completed
                                                ? "#22E0A5"
                                                : "#DFE6EB"
                                        }`,
                                    }}
                                    className={styles.circle}
                                />
                                <span className={styles.statsItemText}>
                                    {item.text}
                                </span>
                            </li>
                        );
                    })}
                </ul>
                <div className={styles.doughnut}>
                    <DashboardDoughnut />
                </div>
            </div>
            <Button className={styles.btn} variant={Variant.GREEN} rounded>
                Создать организацию
            </Button>
        </div>
    );
};

export default HostProfileFill;
