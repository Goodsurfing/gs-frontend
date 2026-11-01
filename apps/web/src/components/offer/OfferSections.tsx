import type { components } from "@goodsurfing/api";

import type { Translate } from "@/i18n/dictionary";
import {
    ageText, conditionName, EXTRA_CONDITIONS, EXTRA_FEATURES, GOODS, gendersText, languagesText,
    money, receptionPlaceText, skillName, timeTypeText,
} from "@/lib/offerText";

import { IconGrid, IconText, InfoCard, InfoCardItem, MaskIcon, RemoteSvg, SectionTitle } from "./parts";

type S = components["schemas"];

/** Ссылки-иконки справочников (навыки, жильё, питание, проезд), уже вставленные сервером */
export type SvgMap = Record<string, string | null>;

const iconKey = (item: { image?: { contentUrl?: string } | null }) => item.image?.contentUrl ?? "";

/** «Когда»: периоды, минимум/максимум дней, приём заявок до (OfferWhenCard). id="description" — первый пункт меню */
export function OfferWhen({ when, t }: { when: S["WhenResult"]; t: Translate }) {
    const empty = t("personalOffer.Точная дата не указана");
    const days = (value: number) => (value > 0 ? value : t("personalOffer.notSpecified"));
    const periods = when.periods ?? [];
    const list = periods.length > 0
        ? periods.map((period, index) => (
             
            <p key={`${period.start}-${period.end}-${index}`}>{`${period.start ?? ""} — ${period.end ?? ""}`}</p>
        ))
        : empty;
    return (
        <div id="description">
            <InfoCard>
                <InfoCardItem className="flex-[2]" title={t("personalOffer.Когда")}>
                    {periods.length > 3 ? <div className="grid w-full grid-cols-2 gap-2.5 down-sm:grid-cols-1">{list}</div> : list}
                </InfoCardItem>
                <div className="flex flex-[2] flex-wrap gap-[30px]">
                    <InfoCardItem title={t("personalOffer.Минимум дней")} text={days(when.durationMinDays)} />
                    <InfoCardItem title={t("personalOffer.Максимум дней")} text={days(when.durationMaxDays)} />
                    <InfoCardItem
                        title={t("personalOffer.Прием заявок до")}
                        text={when.applicationEndDate || t("personalOffer.Не имеет даты окончания")}
                    />
                </div>
            </InfoCard>
        </div>
    );
}

/** «Кто нужен»: пол, возраст, откуда (OfferWhoNeedsCard) */
export function OfferWhoNeeds({ need, t }: { need: S["HowNeedResult"]; t: Translate }) {
    const place = receptionPlaceText(need.receptionPlace, t);
    return (
        <div className="mt-10 flex w-full flex-col gap-5">
            <SectionTitle>{t("personalOffer.Кто нужен")}</SectionTitle>
            <IconGrid>
                <IconText icon={<MaskIcon name="men" className="h-5 w-5" />} text={gendersText(need.genders ?? [], t)} />
                <IconText icon={<MaskIcon name="cake" className="h-5 w-5" />} text={ageText(need.ageMin, need.ageMax, t)} />
                {place && <IconText icon={<MaskIcon name="globe" className="h-5 w-5" />} text={place} />}
            </IconGrid>
        </div>
    );
}

/** Навыки, доп. требования и информация, часы и выходные (OfferWhatToDoCard) */
export function OfferWhatToDo({ todo, svgs, t, tCommon }: { todo: S["WhatToDoResult"]; svgs: SvgMap; t: Translate; tCommon: Translate }) {
    const skills = todo.skills ?? [];
    const extra = todo.additionalSkills ?? [];
    return (
        <div id="whatToDo" className="mt-10 flex flex-col gap-10 border-t border-black pt-5">
            <div className="flex w-full flex-col gap-[30px]">
                {skills.length > 0 && (
                    <>
                        <SectionTitle>{t("personalOffer.Требования к участнику")}</SectionTitle>
                        <IconGrid>
                            {skills.map((skill) => (
                                <IconText key={skill.id} icon={<RemoteSvg svg={svgs[iconKey(skill)] ?? null} className="h-5 w-5" />} text={skillName(skill.name, tCommon)} />
                            ))}
                        </IconGrid>
                    </>
                )}
                {extra.length > 0 && (
                    <>
                        <SectionTitle>{t("personalOffer.Дополнительные требования")}</SectionTitle>
                        <IconGrid>
                            {extra.map((item, index) => (
                                 
                                <IconText key={index} icon={<MaskIcon name="success" className="h-5 w-5" />} text={item} />
                            ))}
                        </IconGrid>
                    </>
                )}
                {todo.externalInfo !== "" && (
                    <>
                        <SectionTitle>{t("personalOffer.Дополнительная информация")}</SectionTitle>
                        <p>{todo.externalInfo}</p>
                    </>
                )}
            </div>
            <div className="flex w-full flex-col gap-[30px]">
                <InfoCard>
                    <InfoCardItem title={t("personalOffer.Количество рабочих часов")} text={`${todo.hour} ${timeTypeText(todo.timeType, t)}`} />
                    <InfoCardItem title={t("personalOffer.Выходных дней в неделю")} text={todo.dayOff} />
                </InfoCard>
            </div>
        </div>
    );
}

/** Описание и краткое описание (OfferDescriptionCard) */
export function OfferDescription({ description, t }: { description: S["DescriptionResult"]; t: Translate }) {
    const text = "text-[14px] font-medium whitespace-pre-line break-words";
    return (
        <div className="mt-10 flex w-full flex-col gap-10">
            <div className="flex flex-col gap-5">
                <SectionTitle>{t("personalOffer.Описание")}</SectionTitle>
                <p className={text}>{description.description}</p>
            </div>
            <div className="flex flex-col gap-5">
                <SectionTitle>{t("personalOffer.Дополнительная информация")}</SectionTitle>
                <p className={text}>{description.shortDescription}</p>
            </div>
        </div>
    );
}

function TermsCard({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex min-h-[107px] w-full max-w-40 flex-col items-center justify-center gap-2 rounded-[2px] border border-caption p-2">
            <span className="text-caption">{icon}</span>
            <span className="text-center text-[14px] font-medium text-ink-secondary">{text}</span>
        </div>
    );
}

/** «Условия»: удобства, проезд, жильё, питание, доп. возможности (OfferTermsCard) */
export function OfferTerms({ condition, svgs, t }: { condition: S["ConditionResult"]; svgs: SvgMap; t: Translate }) {
    const conveniences = condition.conveniences ?? [];
    const features = condition.additionalFeatures ?? [];
    const goods = GOODS.filter((item) => conveniences.includes(item.id));
    const extra = EXTRA_FEATURES.filter((item) => features.includes(item.id));
    const fromApi = (condition.transfers ?? []).length + (condition.houses ?? []).length + (condition.foods ?? []).length;
    if (goods.length + fromApi + extra.length === 0) return null;
    return (
        <div id="terms" className="mt-10 flex flex-col gap-5">
            <SectionTitle>{t("personalOffer.Условия")}</SectionTitle>
            <div className="flex w-full flex-wrap gap-5 down-sm:justify-center">
                {goods.map((item) => (
                    <TermsCard key={item.id} icon={<MaskIcon name={item.icon} className="h-[30px] w-[30px]" />} text={t(`conditions.${item.text}`)} />
                ))}
                {(condition.transfers ?? []).map((item) => (
                    <TermsCard key={`t${item.id}`} icon={<RemoteSvg svg={svgs[iconKey(item)] ?? null} className="h-[30px] w-[30px]" />} text={conditionName(item.name, t)} />
                ))}
                {(condition.houses ?? []).map((item) => (
                    <TermsCard key={`h${item.id}`} icon={<RemoteSvg svg={svgs[iconKey(item)] ?? null} className="h-[30px] w-[30px]" />} text={conditionName(item.name, t)} />
                ))}
                {(condition.foods ?? []).map((item) => (
                    <TermsCard key={`f${item.id}`} icon={<RemoteSvg svg={svgs[iconKey(item)] ?? null} className="h-[30px] w-[30px]" />} text={conditionName(item.name, t)} />
                ))}
                {extra.map((item) => (
                    <TermsCard key={item.id} icon={<MaskIcon name={item.icon} className="h-[30px] w-[30px]" />} text={t(`conditions.${item.text}`)} />
                ))}
            </div>
        </div>
    );
}

/** «Дополнительные условия» — свободный текст (OfferExtraConditionsCard) */
export function OfferExtraConditions({ text, t }: { text: string; t: Translate }) {
    return (
        <div className="mt-10 w-full">
            {text !== "" && (
                <>
                    <SectionTitle>{t("personalOffer.Дополнительные условия")}</SectionTitle>
                    <p className="mt-5">{text}</p>
                </>
            )}
        </div>
    );
}

/** Требования из «последних штрихов»: с детьми, парами… (OfferConditionsCard) */
export function OfferFinishing({ finishing, t }: { finishing: S["FinishingToucheResult"]; t: Translate }) {
    const ids = finishing.additionalConditions ?? [];
    // В порядке, в котором их выбрал организатор (как в старом фронте)
    const items = ids.flatMap((id) => EXTRA_CONDITIONS.filter((item) => item.id === id));
    if (ids.length === 0 && !finishing.onlyVerified) return null;
    return (
        <div className="mt-10 flex w-full flex-col gap-5 border-t border-black pt-5">
            <SectionTitle>{t("personalOffer.Требования к участнику")}</SectionTitle>
            <IconGrid>
                {items.map((item) => (
                    <IconText key={item.id} icon={<MaskIcon name={item.icon} className="h-5 w-5" />} text={t(`finishingTouches.${item.text}`)} />
                ))}
                {finishing.onlyVerified && (
                    <IconText
                        icon={<MaskIcon name="select-check" className="h-5 w-5" />}
                        text={t("finishingTouches.Принимать заявки только от проверенных участников")}
                    />
                )}
            </IconGrid>
        </div>
    );
}

/** Взнос и вознаграждение (OfferPaymentCard) */
export function OfferPayment({ condition, t }: { condition: S["ConditionResult"]; t: Translate }) {
    if (!condition.volunteerContributions && !condition.volunteerRemuneration) return null;
    return (
        <div className="mt-10">
            <InfoCard>
                {condition.volunteerContributions ? (
                    <InfoCardItem title={t("personalOffer.Необходимый взнос")} text={money(condition.volunteerContributions, condition.currency)} />
                ) : null}
                {condition.volunteerRemuneration ? (
                    <InfoCardItem title={t("personalOffer.Денежное вознаграждение")} text={money(condition.volunteerRemuneration, condition.currency)} />
                ) : null}
            </InfoCard>
        </div>
    );
}

/** «Владение языками»: язык чёрным, уровень серым (OfferLanguagesCard) */
export function OfferLanguages({ languages, t }: { languages: S["LanguageResult3"][]; t: Translate }) {
    const value = languagesText(languages as { language: string; languageLevel: string }[], t);
    return (
        <div className="mt-10 flex w-full flex-col gap-5">
            <SectionTitle>{t("personalOffer.Владение языками")}</SectionTitle>
            <span className="text-[14px] font-medium">
                {Array.isArray(value)
                    ? value.map((item, index) => (
                         
                        <span key={index}>
                            <span className="text-black">{item.language}</span>/<span className="text-caption">{item.level}</span>
                            {index < value.length - 1 && ", "}
                        </span>
                    ))
                    : value}
            </span>
        </div>
    );
}
