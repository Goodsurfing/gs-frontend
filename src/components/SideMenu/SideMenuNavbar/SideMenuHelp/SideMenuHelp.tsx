import React, { FC } from "react";

import SupportWidget from "@/components/SupportWidget/SupportWidget";

import helpIcon from "@/shared/assets/icons/navbar/help.svg";

import { ISideMenuHelp } from "../../types/SideMenuHelp.interface";
import styles from "./SideMenuHelp.module.scss";

const SideMenuHelp: FC<ISideMenuHelp> = ({ isOpen, theme }) => {
    return (
        <li className={styles.help}>
            {isOpen ? (
                <SupportWidget theme={theme} />
            ) : (
                <img src={helpIcon} alt="Help" />
            )}
        </li>
    );
};

export default SideMenuHelp;
