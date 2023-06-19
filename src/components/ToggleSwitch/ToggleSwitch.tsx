import cn from 'classnames';
import React, { FC, useState } from 'react';

import styles from './ToggleSwitch.module.scss';

interface ToggleSwitchProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({
  label,
  name,
  onChange,
  ...rest
}) => {
  const [switchState, setSwitchState] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSwitchState(!switchState);
    if (event && onChange) {
      onChange(event);
    }
  };

  return (
      <div className={styles.box}>
          <label
              htmlFor={name}
              className={cn(styles.wrapper, {
                [styles.checked]: switchState,
              })}
          >
              <input
                  checked={switchState}
                  type="radio"
                  name={name}
                  id={name}
                  onChange={(e) => handleChange(e)}
                  {...rest}
              />
          </label>
          <span>{label}</span>
      </div>
  );
};

export default ToggleSwitch;
