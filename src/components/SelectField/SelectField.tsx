import cn from 'classnames';
import React, { FC } from 'react';
import Select, { GroupBase, Props } from 'react-select';

import { IOption } from 'types/select';

import styles from './SelectField.module.scss';

interface Group extends GroupBase<IOption> {}

interface SelectFieldProps extends Props<IOption, boolean, Group> {
    options: IOption[];
    label: string;
    name: string;
    img?: string;
    description?: string;
}

const SelectField: FC<SelectFieldProps> = ({
  isDisabled,
  name,
  img,
  description,
  label,
  ...rest
}) => (
    <div className={styles.wrapper}>
        <div className={styles.labelWrapper}>
            {img && (
            <img className={styles.image} src={img} alt={`${img}`} />
            )}
            <label htmlFor={name} className={styles.label}>
                {label}
            </label>
        </div>
        <Select
            {...rest}
            isDisabled={isDisabled}
            className={cn(styles.dropdown, {
              [styles.disabled]: isDisabled,
            })}
            classNames={{
              option: () => styles.option,
              input: () => styles.input,
              indicatorsContainer: () => styles.menuIndicator,
              menuList: () => styles.menuWrapper,
              menu: () => styles.menuList,
              control: (state) => (state.isDisabled ? cn(styles.control, styles.disabled) : styles.control),
            }}
            name={name}
            unstyled
        />
        {description && (
        <label className={styles.description}>{description}</label>
        )}
    </div>
);

export default SelectField;
