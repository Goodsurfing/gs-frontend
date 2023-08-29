import { memo } from 'react';

import cn from 'classnames';

import { Offer } from '../../model/types/offer';

import styles from './OfferInfoCard.module.scss';

interface HostInfoCardProps {
    className?: string;
    offer: Offer;
}

export const OfferInfoCard = memo((props: HostInfoCardProps) => {
    const { className } = props;
    return (
       <div className={cn(className, styles.wrapper)}>
       </div>
    );
});
