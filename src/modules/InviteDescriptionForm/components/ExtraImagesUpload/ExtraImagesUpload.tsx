import React, { FC } from 'react'

import ExtraImagesItem from '../ExtraImagesItem/ExtraImagesItem';

import styles from './ExtraImagesUpload.module.scss';
import ExtraImagesItemButton from '../ExtraImagesItem/ExtraImagesItemButton/ExtraImagesItemButton';

const ExtraImagesUpload: FC = () => {
  return (
    <div className={styles.wrapper}>
        <ExtraImagesItem id={'asd'} closeBtn={<ExtraImagesItemButton onClick={() => {}} />} />
    </div>
  )
}

export default ExtraImagesUpload