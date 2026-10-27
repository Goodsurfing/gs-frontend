import React from "react";

import { useLocale } from "@/app/providers/LocaleProvider";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import { LegalTranslationNotice } from "@/shared/ui/LegalTranslationNotice/LegalTranslationNotice";
import SideMenu from "@/shared/ui/SideMenu/SideMenu";

import { rulesData } from "../../model/rulesPage";
import { rulesDataEn } from "../../model/rulesPage.en";
import { rulesDataEs } from "../../model/rulesPage.es";
import { Header } from "../Header/Header";
import { TextContent } from "../TextContent/TextContent";
import { TextContentEn } from "../TextContent/TextContent.en";
import { TextContentEs } from "../TextContent/TextContent.es";
import { Сonditions } from "../Сonditions/Сonditions";
import { СonditionsEn } from "../Сonditions/Сonditions.en";
import { СonditionsEs } from "../Сonditions/Сonditions.es";
import styles from "./RulesPage.module.scss";

// Юридический текст — отдельный файл на каждый язык, а не сотни ключей в словарях.
// Юридическую силу имеет русская версия, на en/es над текстом — плашка об этом.
const CONTENT = {
    ru: { Text: TextContent, Conditions: Сonditions, menu: rulesData },
    en: { Text: TextContentEn, Conditions: СonditionsEn, menu: rulesDataEn },
    es: { Text: TextContentEs, Conditions: СonditionsEs, menu: rulesDataEs },
};

const RulesPage = () => {
    const { locale } = useLocale();
    const { Text, Conditions, menu } = CONTENT[locale] ?? CONTENT.ru;
    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Header />
                {locale !== "ru" && <LegalTranslationNotice />}
                <Conditions />
                <div className={styles.sidebarContent}>
                    <SideMenu items={menu} className={styles.sideMenu} />
                    <Text className={styles.content} />
                </div>
            </div>
        </MainPageLayout>
    );
};

export default RulesPage;
