import React, { FC, useState } from 'react';

import InputFile from '@/UI/InputFile/InputFile';

import styles from './ImageUpload.module.scss';

const ImageUpload: FC = () => {
  const [file, setFile] = useState<File>();
  return (
    <InputFile className={styles.input} id='' />
  );
}

export default ImageUpload;