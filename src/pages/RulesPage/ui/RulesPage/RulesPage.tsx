import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import SideMenu from "@/shared/ui/SideMenu/SideMenu";

import { rulesData } from "../../model/rulesPage";
import { Header } from "../Header/Header";
import { TextContent } from "../TextContent/TextContent";
import { Сonditions } from "../Сonditions/Сonditions";
import styles from "./RulesPage.module.scss";

const RulesPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <Сonditions />
            <div className={styles.sidebarContent}>
                <SideMenu items={rulesData} className={styles.sideMenu} />
                <TextContent className={styles.content} />
            </div>
        </div>
    </MainPageLayout>
);

export default RulesPage;
