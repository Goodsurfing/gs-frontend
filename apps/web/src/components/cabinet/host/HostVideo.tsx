"use client";

import { type FormEvent, useCallback, useId, useState } from "react";

import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import { embedUrl, VideoEmbed } from "@/components/video/VideoEmbed";
import { isVideoLink } from "@/lib/videoLinks";

import { useMyOrganization } from "./useMyOrganization";

export interface HostVideoLabels {
    link: string;
    invalid: string;
    add: string;
    empty: string;
    remove: string;
    saved: string;
    error: string;
    loadError: string;
    unsupported: string;
    video: string;
}

/**
 * Видеогалерея организации (HostVideoForm старого фронта): ссылка проверяется
 * при «Добавить видео», список записывается в организацию целиком
 * (videoGallery); удаление — тем же PATCH без ссылки. Лимита нет.
 */
export function HostVideo({ labels }: { labels: HostVideoLabels }) {
    const { organization, failed, save } = useMyOrganization();
    const [url, setUrl] = useState("");
    const [invalid, setInvalid] = useState(false);
    const [checked, setChecked] = useState(false);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const closeToast = useCallback(() => setToast(null), []);
    const inputId = useId();

    if (failed) return <p className="mt-10">{labels.loadError}</p>;
    if (!organization) return <Loading className="mt-10 min-h-[200px]" />;
    const videos = organization.videoGallery ?? [];

    const write = async (next: string[]) => {
        setBusy(true);
        const ok = await save({ videoGallery: next });
        setBusy(false);
        setToast({ text: ok ? labels.saved : labels.error, ok });
    };

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setChecked(true);
        if (!isVideoLink(url)) {
            setInvalid(true);
            return;
        }
        // Поле очищается после попытки — и при успехе, и при ошибке (как в старом)
        const link = url.trim();
        setUrl("");
        setChecked(false);
        await write([...videos, link]);
    };

    return (
        <div className="max-w-[1200px]">
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={closeToast} />
            <form onSubmit={submit} noValidate className="mt-10">
                <label htmlFor={inputId} className="text-[14px] text-caption">{labels.link}</label>
                <div className="mt-[5px] flex gap-5 down-lg:flex-wrap">
                    <div className="w-full">
                        <input
                            id={inputId}
                            type="url"
                            value={url}
                            placeholder={labels.link}
                            aria-invalid={invalid}
                            onChange={(event) => {
                                setUrl(event.target.value);
                                if (checked) setInvalid(!isVideoLink(event.target.value));
                            }}
                            className="box-border max-h-11 w-full rounded-[0.625rem] border border-muted p-3.5 text-[1rem] outline-none"
                        />
                        {invalid && <p role="alert" className="mt-[5px] text-[red]">{labels.invalid}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={!url || busy || invalid}
                        className="flex max-h-11 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-caption bg-primary px-5 py-[15px] text-[14px] whitespace-nowrap text-white hover:text-black disabled:cursor-default disabled:bg-field disabled:text-caption down-lg:w-full"
                    >
                        <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="mr-2.5">
                            <path d="M14 6.66667H7.33333V0H6.66667V6.66667H0V7.33333H6.66667V14H7.33333V7.33333H14V6.66667Z" />
                        </svg>
                        {labels.add}
                    </button>
                </div>
            </form>
            <div className="mt-10 flex min-h-[200px] w-full flex-wrap gap-5">
                {videos.length === 0 && (
                    <div className="flex w-full items-center justify-center text-center"><h4 className="text-[16px] font-bold">{labels.empty}</h4></div>
                )}
                {videos.map((video, index) => (
                    <div key={`${index}-${video}`} className="flex gap-2.5">
                        <div className="w-[320px]">
                            {embedUrl(video)
                                ? <VideoEmbed url={video} title={labels.video} unsupported={labels.unsupported} />
                                : <div className="flex min-h-[200px] items-center justify-center rounded-[8px] bg-card p-6 text-center text-[0.9375rem] text-caption"><p>{labels.unsupported}</p></div>}
                        </div>
                        <button
                            type="button"
                            aria-label={labels.remove}
                            disabled={busy}
                            onClick={() => void write(videos.filter((_, i) => i !== index))}
                            className="mb-auto flex cursor-pointer items-center justify-center p-[5px]"
                        >
                            ✖
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
