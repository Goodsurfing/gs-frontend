import type { Translate } from "@/i18n/dictionary";

/** Плашка над переводом юридического документа: юридическую силу имеет только русская версия. */
export function LegalTranslationNotice({ t }: { t: Translate }) {
    return (
        <p role="note" className="mb-6 rounded-[8px] bg-[#f3f4f6] px-4 py-3 text-[14px] leading-[1.4] text-[#4b5563]">
            {t("Это неофициальный перевод для удобства Юридическую силу имеет только версия документа на русском языке")}
        </p>
    );
}
