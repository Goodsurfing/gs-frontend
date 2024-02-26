import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import SideMenu from "@/shared/ui/SideMenu/SideMenu";

import { privacyPolicyData } from "../../model/privacyPolicyPage";
import { Header } from "../Header/Header";
import { TextContent } from "../TextContent/TextContent";

import styles from "./PrivacyPolicyPage.module.scss";

const RulesPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.sidebarContent}>
                <SideMenu items={privacyPolicyData} className={styles.sideMenu} />
                <TextContent className={styles.content} />
            </div>
        </div>
    </MainPageLayout>
);

export default RulesPage;
