import React, { FC } from "react";

import styles from './HostMainInfoPage.module.scss';
import MainHeader from "@/components/MainHeader/MainHeader";
import SideMenu from "@/components/SideMenu/SideMenu";
import { HostRegistrationSidebarData } from "./HostMainInfoPages.data";
import { Theme } from "@/components/SideMenu/types/SideMenu.interface";
import Input, { InputType } from "@/components/ui/Input/Input";

const HostMainInfoPage: FC = () => {
    return (
        <>
            <MainHeader />
            <SideMenu theme={Theme.LIGHT} content={HostRegistrationSidebarData}/>
            <div className={styles.container}>
                <Input type={InputType.TEXT} label='Адрес' />
            </div>
        </>
    )
}

export default HostMainInfoPage;
