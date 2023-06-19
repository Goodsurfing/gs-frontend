import cn from 'classnames';
import { FC, PropsWithChildren } from 'react';

import { IButtonProps } from './Button.interface';

import styles from './Button.module.scss';

const Button: FC<PropsWithChildren<IButtonProps>> = ({
  variant,
  rounded,
  className,
  children,
  ...restBtnProps
}) => (
    <button
        type="button"
        className={cn(
          styles.btn,
          {
            [styles.primary]: variant === 'PRIMARY',
            [styles.secondary]: variant === 'SECONDARY',
            [styles.outlined]: variant === 'OUTLINED',
            [styles.green]: variant === 'GREEN',
            [styles.black]: variant === 'BLACK',
            [styles.gray]: variant === 'GRAY',
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

export default Button;
