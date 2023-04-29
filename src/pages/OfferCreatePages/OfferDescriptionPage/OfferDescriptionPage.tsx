import React from 'react';

import {InviteDescriptionForm} from '@/modules/InviteDescriptionForm';

import styles from './OfferDescriptionPage.module.scss';

const OfferDescriptionPage = () => {
  return (
    <div className={styles.wrapper}>
        <InviteDescriptionForm />
    </div>
  )
}

export default OfferDescriptionPage