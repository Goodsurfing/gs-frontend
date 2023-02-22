import React, { FC, useState } from "react";

import styles from './HostMainInfoPage.module.scss';
import MainHeader from "@/components/MainHeader/MainHeader";
import SideMenu from "@/components/SideMenu/SideMenu";
import { HostRegistrationSidebarData } from "./HostMainInfoPages.data";
import { Theme } from "@/components/SideMenu/types/SideMenu.interface";
import Input, { InputType } from "@/components/ui/Input/Input";
import logoIcon from "@/assets/icons/navbar/home.svg";
const HostMainInfoPage: FC = () => {
    const [myInput, setInput] = useState('')
    return (
        <>
            <MainHeader />
            <SideMenu theme={Theme.LIGHT} content={HostRegistrationSidebarData}/>
            <div className={styles.container}>
                <Input type={InputType.PASSWORD} label='Адрес' img={logoIcon} value={myInput} setInputValue={setInput} />
            </div>
        </>
    )
}

export default HostMainInfoPage;
