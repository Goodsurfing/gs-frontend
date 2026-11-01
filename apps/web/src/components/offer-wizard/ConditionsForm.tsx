"use client";

import { type FormEvent, useCallback, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";
import {
    conditionsErrors, conditionsFromApi, type ConditionsForm as Form, conditionsToApi, CURRENCIES, errorMessage, parseMoney, toggleIn,
} from "@/lib/offerWizardFinish";

import { clearDraft, readDraft, writeDraft } from "./draft";
import { Caption, ConditionTile, FieldError, localIcon, MaskImage, OldInput, OldSelect, OldTextarea } from "./FinishParts";
import { type DictionaryItem, useDictionary, useVacancyElement, type VacancyElement } from "./useVacancyElement";
import { WizardActions } from "./WizardActions";

export interface ConditionsLabels {
    housing: string;
    food: string;
    travel: string;
    no: string;
    yes: string;
    notSelected: string;
    facilities: string;
    extraFeatures: string;
    /** Удобства и дополнительные возможности: id, подпись, значок из /web/icons/offer */
    goods: { id: string; text: string; icon: string }[];
    features: { id: string; text: string; icon: string }[];
    payment: string;
    contribution: string;
    reward: string;
    currency: string;
    extraConditions: string;
    maxChars: string;
    saved: string;
    error: string;
    save: string;
    next: string;
    unsaved: string;
    loading: string;
    missing: string;
}

const isForm = (value: unknown): value is Form => {
    const v = value as Form | null;
    return !!v && Array.isArray(v.houseIds) && Array.isArray(v.foodIds) && Array.isArray(v.transferIds) && Array.isArray(v.conveniences) && typeof v.currency === "string";
};

/** Значок плитки 30 px (в старом фронте svg стоял строкой — отсюда 5 px снизу) */
const tileIcon = (src: string | null | undefined) => (
    <span className="block h-[35px] w-[30px]"><MaskImage src={src} className="block h-[30px] w-[30px]" /></span>
);

/** Переключатель «Нет / Да» (Switch MUI старого фронта): бегунок белый, дорожка чёрная 38 % или синяя */
function YesNo({ checked, onChange, label, no, yes }: { checked: boolean; onChange: () => void; label: string; no: string; yes: string }) {
    return (
        <div className="flex items-center gap-3">
            <span aria-hidden className="text-[16px] text-ink-secondary">{no}</span>
            <span className="relative inline-flex h-[38px] w-[58px] shrink-0 overflow-hidden p-3">
                <span className={`absolute top-0 left-0 z-[1] inline-flex h-[38px] w-[38px] items-center justify-center rounded-full p-[9px] transition-transform duration-150 hover:bg-[rgba(0,0,0,0.04)] ${checked ? "translate-x-5" : ""}`}>
                    <input type="checkbox" role="switch" aria-label={label} checked={checked} onChange={onChange} className="absolute top-0 -left-full z-[1] m-0 h-full w-[300%] cursor-pointer p-0 opacity-0" />
                    <span className="block h-5 w-5 rounded-full bg-white shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]" />
                </span>
                <span className={`block h-full w-full rounded-[7px] transition-[opacity,background-color] duration-150 ${checked ? "bg-primary" : "bg-black opacity-[0.38]"}`} />
            </span>
            <span aria-hidden className="text-[16px] text-ink-secondary">{yes}</span>
        </div>
    );
}

/** Раздел с переключателем и плитками справочника (ConditionsHousing, ConditionsNutrition, ConditionsTravel) */
function SwitchSection({ title, on, onSwitch, items, selected, onToggle, error, labels }: {
    title: string;
    on: boolean;
    onSwitch: () => void;
    items: DictionaryItem[] | null;
    selected: number[];
    onToggle: (id: number) => void;
    error: string | null;
    labels: ConditionsLabels;
}) {
    return (
        <div>
            <div className="flex flex-col">
                <div className="flex flex-col gap-3.5">
                    <Caption>{title}</Caption>
                    <YesNo checked={on} onChange={onSwitch} label={title} no={labels.no} yes={labels.yes} />
                </div>
                <div className="mt-5 flex flex-wrap gap-5">
                    {items === null ? <Loading label={labels.loading} className="min-h-[78px]" /> : items.map((item) => (
                        <ConditionTile key={item.id} checked={selected.includes(item.id)} onToggle={() => onToggle(item.id)} text={item.name} icon={tileIcon(item.imagePath)} />
                    ))}
                </div>
            </div>
            {error && <FieldError text={error} />}
        </div>
    );
}

/**
 * Шаг «Условия» (OfferConditions старого фронта): жильё, питание, проезд
 * (переключатель «Нет / Да» и плитки справочника; «Да» без выбора — ошибка),
 * удобства, дополнительные возможности, оплата, дополнительные условия.
 * «Сохранить» — PATCH /api/v1/vacancy/condition/{id}.
 */
export function ConditionsForm({ id, locale, nextHref, labels }: { id: string; locale: Locale; nextHref: string; labels: ConditionsLabels }) {
    const { state } = useVacancyElement(id);
    if (state.status === "missing") return <p className="mt-10 text-[18px] text-ink-tertiary">{labels.missing}</p>;
    if (state.status === "loading") return <Loading label={labels.loading} className="min-h-[200px]" />;
    return <ConditionsEditor id={id} locale={locale} nextHref={nextHref} labels={labels} vacancy={state.vacancy} />;
}

function ConditionsEditor({ id, locale, nextHref, labels, vacancy }: { id: string; locale: Locale; nextHref: string; labels: ConditionsLabels; vacancy: VacancyElement }) {
    const session = useSession();
    const houses = useDictionary("/api/v1/house", locale);
    const foods = useDictionary("/api/v1/food", locale);
    const transfers = useDictionary("/api/v1/transfer", locale);
    const [initial] = useState(() => readDraft("conditions", id, isForm));
    const [form, setForm] = useState<Form>(() => initial ?? conditionsFromApi(vacancy.condition));
    const [unsaved, setUnsaved] = useState(!!initial);
    const [touched, setTouched] = useState(false);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    const update = useCallback((next: Form) => {
        setForm(next);
        setUnsaved(true);
        setTouched(true);
        writeDraft("conditions", id, next);
    }, [id]);

    // Как mode: "onChange" старой формы: ошибки — после первой правки или попытки сохранить
    const errors = conditionsErrors(form);
    const error = (on: boolean) => (touched && on ? labels.notSelected : null);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setTouched(true);
        if (errors.housing || errors.food || errors.travel) return;
        setBusy(true);
        setToast(null);
        const result = await browserApi(session.token)
            .PATCH("/api/v1/vacancy/condition/{id}", { params: { path: { id: Number(id) } }, body: conditionsToApi(form) })
            .catch(() => null);
        setBusy(false);
        if (!result || result.error || !result.response.ok) {
            setToast({ text: errorMessage(result?.error) ?? labels.error, ok: false });
            return;
        }
        clearDraft("conditions", id);
        setUnsaved(false);
        setToast({ text: labels.saved, ok: true });
    };

    const money = (key: "contribution" | "reward", input: string) => {
        const value = parseMoney(input);
        if (value !== null) update({ ...form, [key]: value });
    };

    return (
        <form onSubmit={submit} noValidate className="mt-[30px] flex flex-col gap-[30px]">
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
            <SwitchSection
                title={labels.housing}
                on={form.housing}
                onSwitch={() => update({ ...form, housing: !form.housing, houseIds: form.housing ? [] : form.houseIds })}
                items={houses}
                selected={form.houseIds}
                onToggle={(itemId) => form.housing && update({ ...form, houseIds: toggleIn(form.houseIds, itemId) })}
                error={error(errors.housing)}
                labels={labels}
            />
            <SwitchSection
                title={labels.food}
                on={form.food}
                onSwitch={() => update({ ...form, food: !form.food, foodIds: form.food ? [] : form.foodIds })}
                items={foods}
                selected={form.foodIds}
                onToggle={(itemId) => form.food && update({ ...form, foodIds: toggleIn(form.foodIds, itemId) })}
                error={error(errors.food)}
                labels={labels}
            />
            <SwitchSection
                title={labels.travel}
                on={form.travel}
                onSwitch={() => update({ ...form, travel: !form.travel, transferIds: form.travel ? [] : form.transferIds })}
                items={transfers}
                selected={form.transferIds}
                onToggle={(itemId) => form.travel && update({ ...form, transferIds: toggleIn(form.transferIds, itemId) })}
                error={error(errors.travel)}
                labels={labels}
            />
            <div>
                <Caption>{labels.facilities}</Caption>
                <div className="mt-5 flex flex-wrap gap-5">
                    {labels.goods.map((item) => (
                        <ConditionTile key={item.id} checked={form.conveniences.includes(item.id)} onToggle={() => update({ ...form, conveniences: toggleIn(form.conveniences, item.id) })} text={item.text} icon={tileIcon(localIcon(item.icon))} />
                    ))}
                </div>
            </div>
            <div>
                <Caption>{labels.extraFeatures}</Caption>
                <div className="mt-5 flex flex-wrap gap-5">
                    {labels.features.map((item) => (
                        <ConditionTile key={item.id} checked={form.additionalFeatures.includes(item.id)} onToggle={() => update({ ...form, additionalFeatures: toggleIn(form.additionalFeatures, item.id) })} text={item.text} icon={tileIcon(localIcon(item.icon))} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Caption>{labels.payment}</Caption>
                <div className="flex gap-3.5">
                    <OldInput type="number" min={0} labelHidden={labels.contribution} description={labels.contribution} value={String(form.contribution)} onChange={(event) => money("contribution", event.target.value)} className="min-w-0 basis-[227px]" />
                    <OldInput type="number" min={0} labelHidden={labels.reward} description={labels.reward} value={String(form.reward)} onChange={(event) => money("reward", event.target.value)} className="min-w-0 basis-[227px]" />
                    <OldSelect aria-label={labels.currency} value={form.currency} onChange={(event) => update({ ...form, currency: event.target.value })} className="w-[85px] shrink-0 [&>select]:pl-7">
                        {CURRENCIES.map((currency) => <option key={currency.name} value={currency.name}>{currency.symbol}</option>)}
                    </OldSelect>
                </div>
            </div>
            <OldTextarea label={labels.extraConditions} description={labels.maxChars} maxLength={1000} value={form.additionalConditions} onChange={(event) => update({ ...form, additionalConditions: event.target.value })} className="max-w-[600px]" />
            <WizardActions unsaved={unsaved} busy={busy} nextHref={nextHref} labels={labels} className="" />
        </form>
    );
}
