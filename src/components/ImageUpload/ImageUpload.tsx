import cn from 'classnames';
import React, { FC, useState } from 'react';

import { ImageUploadProps } from './ImageUpload.interface';
import styles from './ImageUpload.module.scss';

const ImageUpload: FC<ImageUploadProps> = ({
  id,
  name,
  disabled,
  defaultImage,
  value,
  onChange,
  className,
  ...rest
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) {
      setSelectedImage(file);
    }

    if (event && onChange) {
      onChange(event);
    }
  };

  return (
      <div className={styles.wrapper}>
          <label
              htmlFor={id}
              className={cn(styles.label, className, {
                [styles.disabled]: disabled,
              })}
          >
              {selectedImage && (
              <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Some alt attribute"
                  className={styles.innerImage}
              />
              )}
              {!selectedImage && defaultImage && (
              <img
                  src={defaultImage.url}
                  alt={defaultImage.name}
                  className={styles.innerImage}
              />
              )}
              <input
                  type="file"
                  name={name}
                  id={id}
                  value={value}
                  disabled={disabled}
                  onChange={handleChange}
                  {...rest}
              />
          </label>
      </div>
  );
};

export default ImageUpload;
