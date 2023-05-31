import cn from "classnames";
import React, { FC } from "react";

import useCompareRoutes from "shared/lib/routes/compareRoutes";
import LocaleLink from "shared/ui/LocaleLink/ui/LocaleLink";

import { Theme } from "../../types/SideMenu.interface";
import { ISideMenuLink } from "../../types/SideMenuLink.interface";

import styles from "./SideMenuLink.module.scss";

const SideMenuLink: FC<ISideMenuLink> = ({
  pathname,
  isOpen,
  theme,
  text,
  icon,
  route,
}) => {
  const isMatchRoute = useCompareRoutes(pathname, route);
  return (
      <li className={styles.li}>
          <LocaleLink
              to={`${route}`}
              className={cn(
                styles.link,
                {
                  [styles.dark]: theme === Theme.DARK,
                  [styles.light]: theme === Theme.LIGHT,
                },
                {
                  [styles.openedLink]: isOpen,
                },
              )}
          >
              <img src={icon} alt={text} />
              <span
                  className={cn(
                    styles.text,
                    {
                      [styles.opened]: isOpen,
                    },
                    {
                      [styles.isMatchRoute]: isMatchRoute,
                    },
                  )}
              >
                  {text}
              </span>
          </LocaleLink>
      </li>
  );
};

export default SideMenuLink;
