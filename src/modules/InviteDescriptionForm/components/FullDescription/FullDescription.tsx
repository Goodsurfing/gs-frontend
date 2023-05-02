import Textarea from '@/UI/Textarea/Textarea';
import React, { FC } from 'react';

import { FullDescriptionProps } from './types';

const ShortDescription: FC<FullDescriptionProps> = () => {
  return (
    <Textarea label='Полное описание' description='Не более 3000 знаков' maxLength={3000} />
  );
};

export default ShortDescription;