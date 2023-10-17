import { memo } from "react";
import cn from "classnames";

import styles from "./HostDescriptionAddress.module.scss";

interface HostDescriptionAddressProps {
    className?: string;
}

export const HostDescriptionAddress = memo((props: HostDescriptionAddressProps) => {
    const { className } = props;
    return (
        <div className={cn(styles.wrapper, className)} />
    );
});
