"use client";

import { type FormEvent, useCallback, useState } from "react";

import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/config";
import { type GeoPlace, placeLabel } from "@/lib/offerWizard";

import { type AddressValue, AddressField, geocode } from "./AddressField";
import { clearDraft, readDraft, writeDraft } from "./draft";
import { PickPlaceMap } from "./PickPlaceMap";
import { useVacancy, type Vacancy } from "./useVacancy";
import { WizardActions } from "./WizardActions";

export interface WhereLabels {
    address: string;
    noOptions: string;
    clear: string;
    open: string;
    close: string;
    required: string;
    saved: string;
    error: string;
    save: string;
    next: string;
    unsaved: string;
    loading: string;
    missing: string;
}

const isAddress = (value: unknown): value is AddressValue => {
    const v = value as AddressValue | null;
    return !!v && typeof v.address === "string" && (v.place === null || (typeof v.place === "object" && typeof v.place.latitude === "number" && typeof v.place.longitude === "number"));
};

/** Сохранённый адрес: подпись — как сохранили, без повторного геокодирования */
const fromVacancy = (vacancy: Vacancy): AddressValue => {
    const where = vacancy.where;
    if (!where?.address) return { address: "", place: null };
    return { address: where.address, place: { name: where.address, description: "", latitude: where.latitude, longitude: where.longitude } };
};

/**
 * Шаг «Где» (OfferWhere старого фронта): адрес из подсказок геокодера или
 * щелчком по карте, «Сохранить» — PATCH where, «Дальше» — на шаг «Когда».
 */
export function WhereForm({ id, locale, nextHref, labels }: { id: string; locale: Locale; nextHref: string; labels: WhereLabels }) {
    const { state, save } = useVacancy(id);
    if (state.status === "missing") return <p className="mt-10 text-[18px] text-ink-tertiary">{labels.missing}</p>;
    if (state.status === "loading") return <Loading label={labels.loading} className="min-h-[200px]" />;
    return <WhereEditor id={id} locale={locale} nextHref={nextHref} labels={labels} vacancy={state.vacancy} save={save} />;
}

/** Форма монтируется, когда вакансия уже загружена: начальное значение — несохранённые правки или адрес вакансии */
function WhereEditor({ id, locale, nextHref, labels, vacancy, save }: {
    id: string;
    locale: Locale;
    nextHref: string;
    labels: WhereLabels;
    vacancy: Vacancy;
    save: ReturnType<typeof useVacancy>["save"];
}) {
    const [initial] = useState(() => readDraft("where", id, isAddress));
    const [current, setCurrent] = useState<AddressValue>(() => initial ?? fromVacancy(vacancy));
    const [unsaved, setUnsaved] = useState(!!initial);
    const [touched, setTouched] = useState(false);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    const change = useCallback((next: AddressValue) => {
        setCurrent(next);
        setTouched(true);
        setUnsaved(true);
        writeDraft("where", id, next);
    }, [id]);

    const pickOnMap = useCallback(async (latitude: number, longitude: number) => {
        const [found] = await geocode(`${longitude.toFixed(6)}, ${latitude.toFixed(6)}`, locale);
        const place: GeoPlace = { name: found?.name ?? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, description: found?.description ?? "", latitude, longitude };
        change({ address: placeLabel(place), place });
    }, [change, locale]);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setTouched(true);
        const place = current.place;
        if (!place) return;
        setBusy(true);
        setToast(null);
        const error = await save({ where: { address: current.address, latitude: place.latitude, longitude: place.longitude } }, labels.error);
        setBusy(false);
        if (error) {
            setToast({ text: error, ok: false });
            return;
        }
        clearDraft("where", id);
        setUnsaved(false);
        setToast({ text: labels.saved, ok: true });
    };

    return (
        <form onSubmit={submit} noValidate className="mt-10 w-full">
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
            <AddressField
                value={current}
                onChange={change}
                locale={locale}
                labels={{ label: labels.address, noOptions: labels.noOptions, clear: labels.clear, open: labels.open, close: labels.close }}
            />
            <PickPlaceMap point={current.place ? [current.place.latitude, current.place.longitude] : null} locale={locale} onPick={pickOnMap} />
            {touched && !current.place && <p role="alert" className="mb-[15px] text-[0.75rem] text-[#d32f2f]">{labels.required}</p>}
            <WizardActions unsaved={unsaved} busy={busy} nextHref={nextHref} labels={labels} />
        </form>
    );
}
