import cn from "classnames";
import { FC, ReactNode } from "react";

import styles from "./SignInTitle.module.scss";

interface SignInTitleProps {
  className?: string;
  children?: ReactNode;
}

export const SignInTitle: FC<SignInTitleProps> = ({ className, children }) => (
    <h2 className={cn(styles.title, className)}>{children}</h2>
);
