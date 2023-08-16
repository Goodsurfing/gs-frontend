import { memo } from "react";
import cn from "classnames";

import styles from "./HostDescriptionSocial.module.scss";

interface HostDescriptionSocialProps {
    className?: string;
}

export const HostDescriptionSocial = memo((props: HostDescriptionSocialProps) => {
    const { className } = props;
    return (
        <div className={cn(styles.wrapper, className)}>
            
        </div>
    )
});
