import cn from "classnames";
import React, { FC, PropsWithChildren } from "react";

import styles from "./Popup.module.scss";

interface PopupProps {
    isOpen?: boolean;
    className?: string;
}

const Popup: FC<PropsWithChildren<PopupProps>> = ({
  isOpen,
  className,
  children,
}) => (
    <div
        className={cn(
          styles.wrapper,
          {
            [styles.open]: isOpen,
          },
          className,
        )}
    >
        {children}
    </div>
);

export default Popup;
