import classNames from "classnames";
import { FC } from "react";

import styles from "./Loader.module.scss";

interface LoaderProps {
    className?: string;
}

export const Loader: FC<LoaderProps> = ({ className }) => (
    <div className={classNames(styles.loader, {}, [className])}>
        <div />
        <div />
        <div />
        <div />
    </div>
);
