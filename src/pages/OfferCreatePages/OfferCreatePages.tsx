import cn from "classnames";
import SideMenu from "components/SideMenu/SideMenu";
import { Theme } from "components/SideMenu/types/SideMenu.interface";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { isMatchUrlEndpoint } from "shared/lib/url/isMatchUrlEndpoint";
import MainHeader from "shared/ui/MainHeader/MainHeader";

import OfferDescriptionPage from "../OfferDescriptionPage/OfferDescriptionPage";
import OfferWelcome from "../OfferWelcomePage/ui/OfferWelcome";
import OfferWhenPage from "../OfferWhenPage/OfferWhenPage";
import OfferWherePage from "../OfferWherePage/OfferWherePage";
import OfferWhoNeedsPage from "../OfferWhoNeedsPage/ui/OfferWhoNeedsPage";

import { SideMenuData } from "./OfferCreatePages.data";
import styles from "./OfferCreatePages.module.scss";

const OfferCreatePages = () => {
  const { pathname } = useLocation();

  const [isOpen, setOpen] = useState<boolean>(false);

  const createContent = (path: string) => {
    if (isMatchUrlEndpoint(path, "offers-welcome")) {
      return <OfferWelcome />;
    }
    if (isMatchUrlEndpoint(path, "offers-where")) {
      return <OfferWherePage />;
    }
    if (isMatchUrlEndpoint(path, "offers-when")) {
      return <OfferWhenPage />;
    }
    if (isMatchUrlEndpoint(path, "offers-who-needs")) {
      return <OfferWhoNeedsPage />;
    }
    if (isMatchUrlEndpoint(path, "offers-description")) {
      return <OfferDescriptionPage />;
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
