import cn from "classnames";
import React, { FC, PropsWithChildren, memo } from "react";

import styles from "./Button.module.scss";

export enum Variant {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
  OUTLINED = "OUTLINED",
  GRAY = "GRAY",
  BLACK = "BLACK",
  GREEN = "GREEN"
}

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant;
  rounded?: boolean;
}

const Button: FC<PropsWithChildren<IButtonProps>> = ({
  variant,
  rounded = true,
  className,
  children,
  ...restBtnProps
}) => (
    <button
        type="button"
        className={cn(
          styles.btn,
          {
            [styles.primary]: variant === "PRIMARY",
            [styles.secondary]: variant === "SECONDARY",
            [styles.outlined]: variant === "OUTLINED",
            [styles.green]: variant === "GREEN",
            [styles.black]: variant === "BLACK",
            [styles.gray]: variant === "GRAY",
          },
          {
            [styles.rounded]: rounded,
          },
          className,
        )}
        {...restBtnProps}
        onClick={restBtnProps.onClick}
    >
        {children}
    </button>
);

export const MemoButton = memo(Button);
