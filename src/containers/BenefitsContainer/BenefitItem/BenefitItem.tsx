import React, { FC } from 'react';

import styles from './BenefitItem.module.scss';

interface BenefitItemProps {
    title: string;
    text: string;
    image: string;
}

const BenefitItem: FC<BenefitItemProps> = ({ title, text, image }) => (
    <div className={styles.item}>
        <img src={image} alt={title} />
        <h3>{title}</h3>
        <p>{text}</p>
    </div>
);

export default BenefitItem;
