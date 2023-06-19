import cn from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

import styles from './SignTitle.module.scss';

interface SignTitleProps {
    className?: string;
}

const SignTitle: FC<PropsWithChildren<SignTitleProps>> = ({
  className,
  children,
}) => <h2 className={cn(styles.title, className)}>{children}</h2>;

export default SignTitle;
