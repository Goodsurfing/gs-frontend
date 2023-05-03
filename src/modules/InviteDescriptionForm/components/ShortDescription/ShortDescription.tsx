import Textarea from '@/UI/Textarea/Textarea';
import React, { FC } from 'react';

import { ShortDescriptionProps } from './types';

const ShortDescription: FC<ShortDescriptionProps> = () => {
  return (
    <Textarea label='Краткое описание' description='Не более 250 знаков' maxLength={250} />
  );
};

export default ShortDescription;