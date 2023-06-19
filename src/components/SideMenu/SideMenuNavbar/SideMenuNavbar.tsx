import React, { FC } from 'react';

import { ISideMenuNavbar } from '../types/SideMenuNavbar.interface';
import SideMenuDropdown from './SideMenuDropdown/SideMenuDropdown';
import SideMenuHelp from './SideMenuHelp/SideMenuHelp';
import SideMenuLink from './SideMenuLink/SideMenuLink';
import styles from './SideMenuNavbar.module.scss';

const SideMenuNavbar: FC<ISideMenuNavbar> = ({
  pathname,
  theme,
  content,
  isOpen,
  setOpen,
}) => (
    <ul className={styles.navbarNav}>
        {content.map((item) => (item.dropdownItems ? (
            <SideMenuDropdown
                pathname={pathname}
                route={item.route}
                key={item.text}
                isOpen={isOpen}
                theme={theme}
                icon={item.icon}
                text={item.text}
                setOpen={setOpen}
                dropdownItems={item.dropdownItems}
            />
        ) : (
          item.route && (
          <SideMenuLink
              pathname={pathname}
              key={item.text}
              isOpen={isOpen}
              theme={theme}
              icon={item.icon}
              text={item.text}
              route={item.route}
          />
          )
        )))}
        <SideMenuHelp isOpen={isOpen} theme={theme} />
    </ul>
);

export default SideMenuNavbar;
