import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ButtonLink from 'shared/ui/ButtonLink/ButtonLink';
import SectionTitle from 'components/ui/SectionTitle/SectionTitle';

import ActivityContainer from 'containers/WelcomeContainer/InfoSide/ActivityContainer/ActivityContainer';
import InfoHeader from 'containers/WelcomeContainer/InfoSide/InfoHeader/InfoHeader';

import styles from './InfoSide.module.scss';

const InfoSide: FC = () => {
  const { t } = useTranslation();

  return (
      <div className={styles.wrapper}>
          <InfoHeader />
          <div className={styles.content}>
              <div className={styles.info}>
                  <SectionTitle classNames={styles.title}>
                      {t('main.welcome.title')}
                  </SectionTitle>
                  <ButtonLink className={styles.btn} type="primary" path="/">
                      {t('main.welcome.offers-btn')}
                  </ButtonLink>
              </div>
              <div className={styles.activity}>
                  <h3 className={styles.activityTitle}>
                      {t('main.welcome.activity-title')}
                  </h3>
                  <ActivityContainer />
              </div>
          </div>
      </div>
  );
};

export default InfoSide;
