import type { Locale } from "@/i18n/config";

import { PRIVACY_POLICY_EN } from "./privacyPolicy.en";
import { PRIVACY_POLICY_ES } from "./privacyPolicy.es";
import { PRIVACY_POLICY_RU } from "./privacyPolicy.ru";
import { RULES_EN } from "./rules.en";
import { RULES_ES } from "./rules.es";
import { RULES_RU } from "./rules.ru";
import type { LegalDocument } from "./styles";

export type { LegalDocument } from "./styles";

/** Юридический текст — отдельный файл на язык; юридическую силу имеет русская версия. */
export const RULES: Record<Locale, LegalDocument> = { ru: RULES_RU, en: RULES_EN, es: RULES_ES };
export const PRIVACY_POLICY: Record<Locale, LegalDocument> = { ru: PRIVACY_POLICY_RU, en: PRIVACY_POLICY_EN, es: PRIVACY_POLICY_ES };
