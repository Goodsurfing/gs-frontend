import plusIcon from "@assets/icons/plus-icon.svg";
import cn from "classnames";
import React, { FC, memo } from "react";

import styles from "./AddButton.module.scss";

export interface AddButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const AddButton: FC<AddButtonProps> = ({
  className,
  children,
  onClick = () => {},
  ...restBtnProps
}) => {
  const onBtnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    onClick(e);
  };

  return (
      <button
          type="button"
          className={cn(styles.btn, className)}
          onClick={onBtnClick}
          {...restBtnProps}
      >
          <img src={plusIcon} alt="+" />
          {children}
      </button>
  );
};

export const MemoAddButton = memo(AddButton);
