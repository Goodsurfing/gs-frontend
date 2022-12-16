import React, { FC, PropsWithChildren } from "react";

import styles from "./Sidebar.module.scss";

const Sidebar: FC<PropsWithChildren<unknown>> = ({ children }) => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.wrapper}>
                <nav>
                    <a href="#">fdfsdfsdf</a>
                    <a href="#">fdfsdfsdf</a>
                    <a href="#">fdfsdfsdf</a>
                    <a href="#">fdfsdfsdf</a>
                </nav>
                <div className={styles.widget}>
                    <h2 className={styles.title}>fsdfdsf</h2>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
