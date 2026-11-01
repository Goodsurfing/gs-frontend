import type { LegalDocument } from "@/content/legal";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";

import { PublicShell } from "@/components/layout/PublicShell";

import { LegalSideMenu } from "./LegalSideMenu";
import { LegalTranslationNotice } from "./LegalTranslationNotice";
import { PageBanner } from "./PageBanner";

/**
 * Юридическая страница (правила, политика конфиденциальности): плашка с
 * заголовком, оглавление слева и текст справа — как в старом фронте.
 */
export async function LegalDocumentPage({ locale, title, document }: {
    locale: Locale;
    title: string;
    document: LegalDocument;
}) {
    const t = await getTranslator(locale);

    return (
        <PublicShell locale={locale} topGap>
            <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-center pb-[100px] [@media(max-width:1200px)]:px-5">
                <PageBanner title={title} />
                {locale !== "ru" && <LegalTranslationNotice t={t} />}
                {document.intro && (
                    <section className="flex flex-col items-center justify-center py-[60px]">
                        <h2 className="text-[26px] font-normal">{document.intro.title}</h2>
                        <p className="mt-6 max-w-[780px] text-[0.875rem] font-medium">{document.intro.text}</p>
                    </section>
                )}
                <div className={`flex max-w-[1280px] gap-[30px] ${document.intro ? "" : "mt-[60px]"}`}>
                    <LegalSideMenu items={document.menu} label={title} />
                    <section className="flex w-full flex-col gap-10">{document.body}</section>
                </div>
            </div>
        </PublicShell>
    );
}
