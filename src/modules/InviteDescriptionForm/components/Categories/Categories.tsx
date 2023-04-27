import React from 'react';

import { ToggleButtonComponent } from '@/UI/ToggleButton/ToggleButtonComponent';

import ToggleButtonGroupComponent from '@/components/ToggleButtonGroup/ToggleButtonGroup';

import { tags } from './Categories.data'; 

const Categories = () => {
  return (
    <div>
        <ToggleButtonGroupComponent>
          {tags.map((item, index) => {
            return <ToggleButtonComponent backgroundcolor={item.color} key={index} value={item.value}>{item.text}</ToggleButtonComponent>
          })}
        </ToggleButtonGroupComponent>
    </div>
  )
}

export default Categories