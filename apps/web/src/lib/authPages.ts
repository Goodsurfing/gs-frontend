import type { Metadata } from "next";

import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";

import { pageMetadata } from "./seo";

/** Метаданные служебных страниц входа: заголовок из словаря, в поиск не попадают */
export async function authMetadata(locale: Locale, path: string, titleKey: string): Promise<Metadata> {
    const [t, tMain] = await Promise.all([getTranslator(locale), getTranslator(locale, "main")]);
    return pageMetadata({ locale, path, title: `${t(titleKey)} — GoodSurfing`, description: tMain("seo.description"), noindex: true });
}
