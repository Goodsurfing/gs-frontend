import React from "react";

import { useLocale } from "@/app/providers/LocaleProvider";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import { LegalTranslationNotice } from "@/shared/ui/LegalTranslationNotice/LegalTranslationNotice";
import SideMenu from "@/shared/ui/SideMenu/SideMenu";

import { privacyPolicyData } from "../../model/privacyPolicyPage";
import { privacyPolicyDataEn } from "../../model/privacyPolicyPage.en";
import { privacyPolicyDataEs } from "../../model/privacyPolicyPage.es";
import { Header } from "../Header/Header";
import { TextContent } from "../TextContent/TextContent";
import { TextContentEn } from "../TextContent/TextContent.en";
import { TextContentEs } from "../TextContent/TextContent.es";

import styles from "./PrivacyPolicyPage.module.scss";

// Юридический текст — отдельный файл на каждый язык (см. RulesPage).
const CONTENT = {
    ru: { Text: TextContent, menu: privacyPolicyData },
    en: { Text: TextContentEn, menu: privacyPolicyDataEn },
    es: { Text: TextContentEs, menu: privacyPolicyDataEs },
};

const PrivacyPolicyPage = () => {
    const { locale } = useLocale();
    const { Text, menu } = CONTENT[locale] ?? CONTENT.ru;
    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Header />
                {locale !== "ru" && <LegalTranslationNotice />}
                <div className={styles.sidebarContent}>
                    <SideMenu items={menu} className={styles.sideMenu} />
                    <Text className={styles.content} />
                </div>
            </div>
        </MainPageLayout>
    );
};

export default PrivacyPolicyPage;
