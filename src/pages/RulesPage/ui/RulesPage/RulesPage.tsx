import React from "react";
import { rulesData } from "../../model/rulesPage";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import styles from "./RulesPage.module.scss";
import SideMenu from "@/shared/ui/SideMenu/SideMenu";
import { TextContent } from "../TextContent/TextContent";

const RulesPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <SideMenu items={rulesData} className={styles.sideMenu} />
            <TextContent className={styles.content} />
        </div>
    </MainPageLayout>
);

export default RulesPage;
