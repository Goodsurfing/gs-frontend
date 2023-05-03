import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardDoughnut from "@/components/DashboardDoughnut/DashboardDoughnut";

import { ProfileFillItems } from "./HostProfileFill.data";
import styles from "./HostProfileFill.module.scss";
import HostProfileFillPoint from "./HostProfileFillPoint/HostProfileFillPoint";

const HostProfileFill: FC = () => {
    const [degrees, setDegrees] = useState<Array<number>>([360, 0]);

    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.titleWrapper}>
                <h2 className={styles.title}>Заполненность профиля</h2>
            </div>
            <div className={styles.statsContainer}>
                <div className={styles.statsWrapper}>
                    <ul className={styles.stats}>
                        {ProfileFillItems.map((item) => {
                            return (
                                <HostProfileFillPoint
                                    circleColor={
                                        item.completed ? "#02CC9B" : "#DFE6EB"
                                    }
                                    key={item.text}
                                    text={item.text}
                                />
                            );
                        })}
                    </ul>
                    <div className={styles.btnWrapper}>
                        <Button
                            className={styles.btn}
                            variant={Variant.GREEN}
                            rounded
                            onClick={() => {
                                navigate("/host/registration");
                            }}
                        >
                            Создать организацию
                        </Button>
                    </div>
                </div>
                <div className={styles.doughnut}>
                    <DashboardDoughnut
                        className={styles.doughnutInner}
                        degrees={degrees}
                        setDegrees={setDegrees}
                    >
                        <div className={styles.percents}>{degrees[0]}%</div>
                    </DashboardDoughnut>
                </div>
            </div>
        </div>
    );
};

export default React.memo(HostProfileFill);
