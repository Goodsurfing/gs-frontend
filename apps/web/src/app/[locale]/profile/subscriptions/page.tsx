import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { SavedSearches } from "@/components/cabinet/profile/SavedSearches";
import { isLocale, type Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { serverApi } from "@/lib/api";
import { authMetadata } from "@/lib/authPages";
import { profileMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

const KEYS = ["intro", "count", "empty", "toMap", "rename", "save", "email", "weekly", "daily", "off", "push", "open", "delete", "deleteConfirm", "cancel", "saved", "error", "loadError", "retry"] as const;
const SUMMARY = { all: "sumAll", from: "sumFrom", to: "sumTo", days: "sumDays", kids: "sumKids", verified: "sumVerified", food: "sumFood", housing: "sumHousing", paidTravel: "sumPaidTravel", passed: "sumPassed" } as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.profileSubscriptions(locale), "main.sidebar.Подписки на поиск") : {};
}

/** Названия направлений — для меток «о чём подписка»; не загрузились — метки без направлений */
async function getCategoryNames(locale: Locale): Promise<Record<number, string>> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/category", { params: { query: { lang: locale } }, signal: AbortSignal.timeout(5000) });
        return Object.fromEntries((data ?? []).map((category) => [category.id, category.name ?? ""]));
    } catch {
        return {};
    }
}

/** Кабинет: подписки на подборку вакансий (05.11.2026) */
export default async function ProfileSubscriptionsPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tp] = await Promise.all([getTranslator(locale), getTranslator(locale, "profile")]);
    // Подстановки заполняет компонент — переводчик заменил бы их пустой строкой
    const keep = { name: "{{name}}", count: "{{count}}", limit: "{{limit}}", date: "{{date}}", min: "{{min}}", max: "{{max}}" };
    const label = (key: string) => tp(`subscriptions.${key}`, keep);
    const categories = await getCategoryNames(locale);
    return (
        <CabinetShell locale={locale} items={profileMenu(locale, t)}>
            <main className="w-full">
                <h2 className="text-[1.625rem] font-normal">{label("title")}</h2>
                <SavedSearches
                    mapHref={routes.offersMap(locale)}
                    categoryNames={categories}
                    labels={{
                        ...(Object.fromEntries(KEYS.map((key) => [key, label(key)])) as Record<(typeof KEYS)[number], string>),
                        summary: Object.fromEntries(Object.entries(SUMMARY).map(([name, key]) => [name, label(key)])) as Record<keyof typeof SUMMARY, string>,
                    }}
                />
            </main>
        </CabinetShell>
    );
}
