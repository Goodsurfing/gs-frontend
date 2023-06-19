import React from 'react';
import Button from 'components/ui/Button/Button';
import { Variant } from 'components/ui/Button/Button.interface';
import YMapWithAddress from 'components/Ymaps/YMapWithAddress/YMapWithAddress';

import styles from './OfferWherePage.module.scss';

const OfferWherePage = () => (
    <div className={styles.wrapper}>
        <div className={styles.ymaps}>
            {/* <YMapWithAddress /> */}
        </div>
        <Button variant={Variant.PRIMARY} rounded className={styles.btn}>
            Сохранить
        </Button>
    </div>
);

export default OfferWherePage;
