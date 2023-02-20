import { FC, PropsWithChildren } from "react";

import styles from "./Sidebar.module.scss";

const Sidebar: FC<PropsWithChildren<unknown>> = ({ children }) => {
    return <div className={styles.sidebar}>{children}</div>;
};

export default Sidebar;
