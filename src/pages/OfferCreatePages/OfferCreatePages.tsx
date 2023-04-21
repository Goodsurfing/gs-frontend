import MainHeader from "@/UI/MainHeader/MainHeader";
import cn from "classnames";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import SideMenu from "@/components/SideMenu/SideMenu";
import { Theme } from "@/components/SideMenu/types/SideMenu.interface";

import { isMatchUrlEndpoint } from "@/utils/url/isMatchUrlEndpoint";

import { SideMenuData } from "./OfferCreatePages.data";
import styles from "./OfferCreatePages.module.scss";
import OfferWelcome from "./OfferWelcome/OfferWelcome";
import OfferWhenPage from "./OfferWhen/OfferWhenPage";
import OfferWherePage from "./OfferWhere/OfferWherePage";
import OfferWhoNeedsPage from "./OfferWhoNeeds/OfferWhoNeedsPage";

const OfferCreatePages = () => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const { pathname } = useLocation();

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
