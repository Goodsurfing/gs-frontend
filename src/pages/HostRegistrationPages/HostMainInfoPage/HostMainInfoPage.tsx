import cn from "classnames";
import React, { FC, useState } from "react";

import MainHeader from "@/components/MainHeader/MainHeader";
import ProfileInput from "@/components/ProfileInput/ProfileInput";
import SideMenu from "@/components/SideMenu/SideMenu";
import { Theme } from "@/components/SideMenu/types/SideMenu.interface";

import HostMainInfoContent from "./HostMainInfoContent/HostMainInfoContent";
import styles from "./HostMainInfoPage.module.scss";
import { HostRegistrationSidebarData } from "./HostMainInfoPages.data";

const HostMainInfoPage: FC = () => {
    const [isOpen, setOpen] = useState<boolean>(false);
    return (
        <div className={styles.layout}>
            <MainHeader />
            <SideMenu
                isOpen={isOpen}
                setOpen={setOpen}
                theme={Theme.LIGHT}
                content={HostRegistrationSidebarData}
            />
            <div
                className={cn(styles.wrapper, {
                    [styles.opened]: isOpen,
                })}
            >
                <HostMainInfoContent />
                <ProfileInput route="/profile/info" />
            </div>
        </div>
    );
};

export default HostMainInfoPage;
