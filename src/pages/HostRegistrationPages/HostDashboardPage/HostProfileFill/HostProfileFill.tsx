import React, { FC } from "react";

import Button from "@/components/ui/Button/Button";
import { Variant } from "@/components/ui/Button/Button.interface";

import styles from "./HostProfileFill.module.scss";
import { ProfileFillItems } from "./HostProfileFill.data";

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
                    <li className={styles.statsItem}>
                      <div style={{backgroundColor: item.color}} className={styles.circle} />
                      <span className={styles.statsItemText}>{item.text}</span>
                    </li>
                    )
                })} 
                </ul>
                <Button className={styles.btn} variant={Variant.GREEN} rounded>
                    Создать организацию
                </Button>
            </div>
        </div>
    );
};

export default HostProfileFill;
