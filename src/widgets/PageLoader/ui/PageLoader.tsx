import classNames from "classnames";
import { FC } from "react";

import Loader from "shared/ui/Loader/Loader";

import styles from "./PageLoader.module.scss";

interface PageLoaderProps {
    className?: string;
}

export const PageLoader: FC<PageLoaderProps> = ({ className }) => (
    <div className={classNames(styles.wrapper, {}, [className])}>
        <Loader />
    </div>
);
