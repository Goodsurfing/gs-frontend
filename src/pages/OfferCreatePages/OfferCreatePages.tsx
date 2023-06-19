import cn from 'classnames';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import SideMenu from 'components/SideMenu/SideMenu';
import { Theme } from 'components/SideMenu/types/SideMenu.interface';
import MainHeader from 'components/ui/MainHeader/MainHeader';

import { isMatchUrlEndpoint } from 'shared/utils/url/isMatchUrlEndpoint';

import { SideMenuData } from './OfferCreatePages.data';
import styles from './OfferCreatePages.module.scss';
import OfferWelcome from './OfferWelcome/OfferWelcome';

const OfferCreatePages = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  const createContent = (path: string) => {
    if (isMatchUrlEndpoint(path, 'offers-welcome')) {
      return <OfferWelcome />;
    }
    if (isMatchUrlEndpoint(path, 'reset-password')) {
      return <></>;
    }
  };

  return (
      <div className={styles.layout}>
          <MainHeader />
          <SideMenu
              setOpen={setOpen}
              isOpen={isOpen}
              theme={Theme.LIGHT}
              content={SideMenuData}
          />
          <div
              className={cn(styles.wrapper, {
                [styles.opened]: isOpen,
              })}
          >
              {createContent(pathname)}
          </div>
      </div>
  );
};

export default OfferCreatePages;
