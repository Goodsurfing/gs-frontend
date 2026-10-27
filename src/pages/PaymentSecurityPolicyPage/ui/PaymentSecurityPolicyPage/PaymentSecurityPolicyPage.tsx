import React from "react";

import { useLocale } from "@/app/providers/LocaleProvider";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import { LegalTranslationNotice } from "@/shared/ui/LegalTranslationNotice/LegalTranslationNotice";

import { Header } from "../Header/Header";
import { TextContent } from "../TextContent/TextContent";
import { TextContentEn } from "../TextContent/TextContent.en";
import { TextContentEs } from "../TextContent/TextContent.es";

import styles from "./PaymentSecurityPolicyPage.module.scss";

// Юридический текст — отдельный файл на каждый язык (см. RulesPage).
const TEXT = { ru: TextContent, en: TextContentEn, es: TextContentEs };

const PaymentSecurityPolicyPage = () => {
    const { locale } = useLocale();
    const Text = TEXT[locale] ?? TextContent;
    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Header />
                {locale !== "ru" && <LegalTranslationNotice />}
                <Text className={styles.content} />
            </div>
        </MainPageLayout>
    );
};

export default PaymentSecurityPolicyPage;
