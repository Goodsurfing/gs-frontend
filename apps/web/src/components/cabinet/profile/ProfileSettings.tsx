"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";

import { blueButton, TextField } from "@/components/form/fields";
import { useSession } from "@/components/session/SessionProvider";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Loading } from "@/components/ui/Loading";
import { Switch, Toast } from "@/components/ui/Toast";
import { browserApi } from "@/lib/browserApi";

type Message = { text: string; ok: boolean } | null;
type Profile = Record<string, unknown> & { volunteer?: unknown; hostId?: string | null; isActive?: boolean; marketingConsent?: boolean; showInEventFeed?: boolean; favoriteCategories?: number[] };

/**
 * «Куда бы вы хотели поехать» (ProfilePreferencesForm старого фронта):
 * плитки направлений, выбор нескольких; «Сохранить» — PATCH favorite-category.
 */
export function PreferencesForm({ categories, labels }: {
    categories: { id: number; name: string; image?: string }[];
    labels: { title: string; hint: string; selected: string; save: string; saved: string; error: string };
}) {
    const session = useSession();
    const profile = session.profile as Profile | null;
    const [selected, setSelected] = useState<number[] | null>(null);
    const [message, setMessage] = useState<Message>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        // Выбор берётся из профиля, когда сессия его загрузила
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (profile && selected === null) setSelected(profile.favoriteCategories ?? []);
    }, [profile, selected]);
    if (selected === null) return <Loading className="min-h-[300px]" />;

    const toggle = (id: number) => setSelected(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
    const save = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setBusy(true);
        const { error } = await browserApi(session.token).PATCH("/api/v1/profile/favorite-category", { body: { favoriteCategoryIds: selected } as never }).catch(() => ({ error: true }));
        setMessage(error ? { text: labels.error, ok: false } : { text: labels.saved, ok: true });
        setBusy(false);
    };

    return (
        <form onSubmit={save} className="flex max-w-[950px] flex-col gap-5">
            <Toast text={message?.text ?? null} ok={message?.ok} onClose={() => setMessage(null)} />
            {/* Один заголовок и пояснение (раньше было два заголовка подряд). Плитки — ровная сетка, подпись внизу
                на затемнении, перенос по слогам вместо разрыва слова посередине; выбранная — в зелёной рамке. */}
            <div className="mt-[30px]">
                <h2 className="text-[26px] font-normal down-lg:text-center">{labels.title}</h2>
                <p className="mt-2 text-[15px] leading-[140%] text-ink-tertiary down-lg:text-center">{labels.hint}</p>
                <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-4 down-sm:grid-cols-3 down-sm:gap-2.5">
                    {categories.map((category) => {
                        const on = selected.includes(category.id);
                        return (
                            <button
                                key={category.id}
                                type="button"
                                aria-pressed={on}
                                onClick={() => toggle(category.id)}
                                style={category.image ? { backgroundImage: `url(${JSON.stringify(category.image)})` } : undefined}
                                className={`group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-[10px] bg-accent-bg bg-cover bg-center bg-no-repeat -outline-offset-3 transition-[outline-color] ${on ? "outline-3 outline-cta" : "outline-3 outline-transparent hover:outline-accent-bg"}`}
                            >
                                <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
                                <span className="absolute inset-x-0 bottom-0 p-2.5 text-left text-[15px] leading-[120%] font-semibold text-white hyphens-auto down-sm:p-2 down-sm:text-[13px]">{category.name}</span>
                                {on && (
                                    <span aria-hidden className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-cta text-white shadow">
                                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.2 3L13 4.5" /></svg>
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="flex items-center gap-5 down-lg:justify-center">
                <button type="submit" disabled={busy} className={`${blueButton} w-fit !px-[55px]`}>{labels.save}</button>
                <span className="text-[15px] whitespace-nowrap text-ink-tertiary">{labels.selected}: {selected.length}</span>
            </div>
        </form>
    );
}

/**
 * «Роль» (ProfileRoleWidget старого фронта): гудсёрфер и организатор.
 * Стать волонтёром — после подтверждения создаётся пустой профиль
 * волонтёра и переход на его рабочий стол (или туда, откуда пришли:
 * ?next= — вакансия, ?nextDonation= — сбор); организатором — анкета
 * организации. Уже выбранная роль ведёт на свой рабочий стол.
 */
export function RoleCards({ hrefs, labels }: {
    hrefs: { volunteerDashboard: string; hostDashboard: string; hostRegister: string; offer: string; fundraise: string };
    labels: {
        volunteer: { title: string; text: string; become: string; already: string; confirm: string };
        host: { title: string; text: string; become: string; already: string; confirm: string };
        /** Пометка выбранной роли и ссылка на её рабочий стол */
        current: string;
        toDashboard: string;
        yes: string;
        no: string;
        becameVolunteer: string;
    };
}) {
    const session = useSession();
    const profile = session.profile as Profile | null;
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<Message>(null);
    if (!profile) return <Loading className="min-h-[300px]" />;

    // Сразу, без «Вы уверены?» и трёх секунд паузы (06.11.2026): роль можно добавить в любой момент,
    // а лишний шаг терял новичков — роль волонтёра выбирали 43 % зарегистрировавшихся
    const become = async (role: "volunteer" | "host") => {
        if (role === "host") {
            window.location.assign(hrefs.hostRegister);
            return;
        }
        setBusy(true);
        const { error } = await browserApi(session.token).POST("/api/v1/personal/volunteer", { body: { externalInfo: "", skills: [], additionalSkills: [] } as never }).catch(() => ({ error: true }));
        if (error) {
            setBusy(false);
            setMessage({ text: String((error as { detail?: string })?.detail ?? "Ошибка"), ok: false });
            return;
        }
        const params = new URLSearchParams(window.location.search);
        const next = params.get("next");
        const donation = params.get("nextDonation");
        window.location.assign(next ? hrefs.offer.replace("{id}", next) : donation ? hrefs.fundraise.replace("{id}", donation) : hrefs.volunteerDashboard);
    };

    const card = (role: "volunteer" | "host", image: string) => {
        const has = role === "volunteer" ? !!profile.volunteer : !!profile.hostId;
        const text = labels[role];
        return (
            // Выбранная роль — зелёная рамка и «✓ Ваша роль», а вместо кнопки-призыва ссылка на рабочий стол:
            // одинаковые синие кнопки «Вы уже стали…» и «Стать…» читались как «роль можно выбрать снова»
            <div className={`relative flex w-full max-w-[485px] flex-col items-center justify-center gap-y-[60px] self-stretch bg-white px-[30px] pt-[50px] pb-[60px] shadow-[0_5px_20px_0_rgba(14,29,39,0.05)] ${has ? "outline-2 -outline-offset-2 outline-cta" : ""}`}>
                {has && (
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-cta px-3 py-1 text-[14px] font-semibold text-white">
                        <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.2 3L13 4.5" /></svg>
                        {labels.current}
                    </span>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element -- иллюстрация роли */}
                <img src={`/web/icons/navbar/${image}.svg`} alt="" />
                <span className="text-[26px] leading-[120%]">{text.title}</span>
                <span className="text-center text-[18px] font-medium text-primary">{text.text}</span>
                {has
                    ? <a href={role === "volunteer" ? hrefs.volunteerDashboard : hrefs.hostDashboard} aria-label={`${text.already}. ${labels.toDashboard}`} className="rounded-[10px] border border-primary bg-white px-8 py-2.5 text-center text-[16px] leading-[1.75] tracking-[0.02857em] text-primary uppercase no-underline hover:bg-primary hover:text-white down-lg:w-[90%] down-lg:px-10">{`${labels.toDashboard}\u00a0→`}</a>
                    : <button type="button" disabled={busy} onClick={() => void become(role)} className="cursor-pointer rounded-[10px] bg-primary disabled:cursor-wait disabled:opacity-70 px-[60px] py-2.5 text-[16px] leading-[1.75] tracking-[0.02857em] text-white uppercase hover:bg-[#60bdff] down-lg:w-[90%] down-lg:px-10">{text.become}</button>}
            </div>
        );
    };

    return (
        <div className="mt-[30px] flex w-full flex-row gap-[30px] down-lg:flex-wrap down-lg:justify-center">
            <Toast text={message?.text ?? null} ok={message?.ok} onClose={() => setMessage(null)} />
            {card("volunteer", "profile-goodsurfer")}
            {card("host", "profile-host")}
        </div>
    );
}

/**
 * «Изменение пароля» (ProfileResetPasswordForm старого фронта): если пароль
 * когда-то задавался — нужен текущий; вошедшим через VK без пароля — только новый.
 */
export function PasswordForm({ labels }: {
    labels: { current: string; next: string; repeat: string; save: string; saved: string; error: string; currentRequired: string; nextRequired: string; mismatch: string; repeatRequired: string };
}) {
    const session = useSession();
    const [needCurrent, setNeedCurrent] = useState<boolean | null>(null);
    const [values, setValues] = useState({ current: "", next: "", repeat: "" });
    const [errors, setErrors] = useState<Partial<Record<keyof typeof values, string>>>({});
    const [message, setMessage] = useState<Message>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        browserApi(session.token).GET("/api/v1/profile/password/is-change")
            .then(({ data }) => !cancelled && setNeedCurrent((data as { isChangePassword?: boolean } | undefined)?.isChangePassword === true))
            .catch(() => !cancelled && setNeedCurrent(true));
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token]);
    if (needCurrent === null) return <Loading className="min-h-[200px]" />;

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const next: typeof errors = {};
        if (needCurrent && !values.current) next.current = labels.currentRequired;
        if (!values.next) next.next = labels.nextRequired;
        if (!values.repeat) next.repeat = labels.repeatRequired;
        else if (values.repeat !== values.next) next.repeat = labels.mismatch;
        setErrors(next);
        if (Object.keys(next).length) return;
        setBusy(true);
        const api = browserApi(session.token);
        const result = await (needCurrent
            ? api.POST("/api/v1/personal/profile/change-password", { body: { oldPassword: values.current, plainPassword: values.next } as never })
            // Бэкенд принимает только PATCH (в старом фронте был POST — смена пароля без текущего не работала)
            : api.PATCH("/api/v1/profile/password/change", { body: { password: values.next } as never })).catch(() => ({ error: { detail: labels.error } }));
        setBusy(false);
        if (result.error) {
            setMessage({ text: (result.error as { detail?: string; title?: string }).detail || (result.error as { title?: string }).title || labels.error, ok: false });
            return;
        }
        setMessage({ text: labels.saved, ok: true });
        setValues({ current: "", next: "", repeat: "" });
        setNeedCurrent(true);
    };
    // Подписи у этой формы свои (ProfileResetPasswordForm): 14 px серым над полем, отступ 8 px
    const input = (name: keyof typeof values, label: string, autoComplete: string) => (
        <label className="flex flex-col gap-2 text-[14px] text-caption">
            {label}
            <TextField type="password" aria-label={label} autoComplete={autoComplete} value={values[name]} error={errors[name]} onChange={(event) => setValues({ ...values, [name]: event.target.value })} />
        </label>
    );

    return (
        <form onSubmit={submit} noValidate className="flex w-[440px] max-w-full flex-col gap-[30px] down-lg:w-full">
            <Toast text={message?.text ?? null} ok={message?.ok} onClose={() => setMessage(null)} />
            {needCurrent && input("current", labels.current, "current-password")}
            {input("next", labels.next, "new-password")}
            {input("repeat", labels.repeat, "new-password")}
            <button type="submit" disabled={busy} className={`${blueButton} max-w-[280px] down-lg:max-w-none`}>{labels.save}</button>
        </form>
    );
}

/**
 * «Приватность» (ProfilePrivacy старого фронта): скрыть аккаунт (с задержкой
 * 0,5 с — частые щелчки не шлют лишних запросов), рассылка (согласие, GS-203),
 * удаление аккаунта с подтверждением и выходом.
 */
export function PrivacySettings({ mainHref, labels }: {
    mainHref: string;
    labels: {
        hide: string; hideText: string; newsletter: string; newsletterText: string; newsletterWording: string;
        delete: string; deleteText: string; deleteConfirm: string; yes: string; no: string;
        deleteError: string; hideError: string; blocked: string; newsletterError: string;
        feed: string; feedText: string; feedError: string;
    };
}) {
    const session = useSession();
    const profile = session.profile as Profile | null;
    const [hidden, setHidden] = useState<boolean | null>(null);
    const [consent, setConsent] = useState(false);
    const [inFeed, setInFeed] = useState(true);
    const [asking, setAsking] = useState(false);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<Message>(null);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        // Состояние переключателей берётся из профиля, когда сессия его загрузила
        if (!profile || hidden !== null) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHidden(!profile.isActive);
        setConsent(!!profile.marketingConsent);
        setInFeed(profile.showInEventFeed !== false);
    }, [profile, hidden]);
    useEffect(() => () => clearTimeout(timer.current), []);
    if (hidden === null) return <Loading className="min-h-[200px]" />;

    const api = () => browserApi(session.token);
    const toggleHidden = (value: boolean) => {
        setHidden(value);
        clearTimeout(timer.current);
        timer.current = setTimeout(async () => {
            const { error } = await api().POST("/api/v1/profile/toggle-active", { body: { isActive: !value } as never }).catch(() => ({ error: {} }));
            if (error) {
                setHidden(!value);
                setMessage({ text: (error as { error?: string }).error === "IS_ADMIN_BLOCK" ? labels.blocked : labels.hideError, ok: false });
            }
        }, 500);
    };
    const toggleConsent = async (value: boolean) => {
        setConsent(value);
        const { error } = await api().PATCH("/api/v1/profile/marketing-consent", { body: { consent: value, wording: labels.newsletterWording } as never }).catch(() => ({ error: true }));
        if (error) {
            setConsent(!value);
            setMessage({ text: labels.newsletterError, ok: false });
        }
    };
    // Лента событий на главной (GS-241): имя, город и аватар в карточках «получен значок», «едет в проект»
    const toggleFeed = async (value: boolean) => {
        setInFeed(value);
        const { error } = await api().PATCH("/api/v1/profile/event-feed", { body: { show: value } }).catch(() => ({ error: true }));
        if (error) {
            setInFeed(!value);
            setMessage({ text: labels.feedError, ok: false });
        }
    };
    const remove = async () => {
        setBusy(true);
        const { error } = await api().DELETE("/api/v1/profile/delete").catch(() => ({ error: true }));
        setBusy(false);
        setAsking(false);
        if (error) {
            setMessage({ text: labels.deleteError, ok: false });
            return;
        }
        await session.logout();
        window.location.href = mainHref;
    };

    const block = "mt-[33px] font-medium text-caption";
    return (
        <div className="mt-[33px]">
            <Toast text={message?.text ?? null} onClose={() => setMessage(null)} />
            <div className={block}>
                <div className="flex items-center gap-1"><Switch checked={hidden} onChange={toggleHidden} labelledBy="privacy-hide" /><span id="privacy-hide" className="text-ink-secondary">{labels.hide}</span></div>
                <p className="max-w-[415px] text-[12px]">{labels.hideText}</p>
            </div>
            <div className={block}>
                <div className="flex items-center gap-1"><Switch checked={consent} onChange={(value) => void toggleConsent(value)} labelledBy="privacy-newsletter" /><span id="privacy-newsletter" className="text-ink-secondary">{labels.newsletter}</span></div>
                <p className="max-w-[415px] text-[12px]">{labels.newsletterText}</p>
            </div>
            <div className={block}>
                <div className="flex items-center gap-1"><Switch checked={inFeed} onChange={(value) => void toggleFeed(value)} labelledBy="privacy-feed" /><span id="privacy-feed" className="text-ink-secondary">{labels.feed}</span></div>
                <p className="max-w-[415px] text-[12px]">{labels.feedText}</p>
            </div>
            <div className={block}>
                <button type="button" onClick={() => setAsking(true)} className="cursor-pointer rounded-[10px] border border-primary bg-primary px-[50px] py-2.5 text-[16px] leading-[120%] text-white transition-all hover:bg-white hover:text-primary">{labels.delete}</button>
                <div className="mt-3.5 flex gap-2 down-lg:flex-wrap">
                    <span aria-hidden className="h-6 w-6 shrink-0 bg-[url(/web/icons/navbar/help.svg)] bg-contain" />
                    <p className="max-w-[415px] text-[12px]">{labels.deleteText}</p>
                </div>
            </div>
            <ConfirmDialog open={asking} text={labels.deleteConfirm} confirm={labels.yes} cancel={labels.no} busy={busy} onConfirm={() => void remove()} onClose={() => setAsking(false)} />
        </div>
    );
}
