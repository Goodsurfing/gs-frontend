import cn from "classnames";
import SideMenu from "components/SideMenu/SideMenu";
import { Theme } from "components/SideMenu/types/SideMenu.interface";
import { isMatchUrlEndpoint } from "lib/url/isMatchUrlEndpoint";
import React, { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import MainHeader from "shared/ui/MainHeader/MainHeader";

import HostDashboardPage from "./HostDashboardPage/HostDashboardPage";
import HostMainInfoPage from "./HostMainInfoPage/HostMainInfoPage";
import HostOffersPage from "./HostOffersPage/HostOffersPage";
import { HostPagesSidebarData } from "./HostPages.data";
import styles from "./HostPages.module.scss";

const HostPage: FC = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  const createContent = (path: string) => {
    if (isMatchUrlEndpoint(path, "host")) {
      return <HostDashboardPage />;
    }
    if (isMatchUrlEndpoint(path, "organization/registration")) {
      return <HostMainInfoPage />;
    }
    if (isMatchUrlEndpoint(path, "offers")) {
      return <HostOffersPage />;
    }
  };

  return (
      <div className={styles.layout}>
          <MainHeader />
          <SideMenu
              isOpen={isOpen}
              setOpen={setOpen}
              theme={Theme.LIGHT}
              content={HostPagesSidebarData}
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

export default HostPage;
