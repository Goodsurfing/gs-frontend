import React from 'react';

import { ToggleButtonComponent } from '@/UI/ToggleButton/ToggleButtonComponent';

import ToggleButtonGroupComponent from '@/components/ToggleButtonGroup/ToggleButtonGroup';

import { tags } from './Categories.data'; 

import styles from './Categories.module.scss';

const Categories = () => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>Категория приглашения</p>
      <div className={styles.container}>
          <ToggleButtonGroupComponent sx={{ display: 'flex', gap: '30px' }}>
            {tags.map((item, index) => {
              return <ToggleButtonComponent sx={{
                mt: '14px',
              }} backgroundcolor={item.color} key={index} value={item.value}>{item.text}</ToggleButtonComponent>
            })}
          </ToggleButtonGroupComponent>        
      </div>

    </div>
  )
}

export default Categories