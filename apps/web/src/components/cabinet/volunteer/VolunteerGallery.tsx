"use client";

import { type FormEvent, useEffect, useId, useRef, useState } from "react";

import { ImagesUploader, type ImagesUploaderLabels } from "@/components/cabinet/ImagesUploader";
import { useSession } from "@/components/session/SessionProvider";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { VideoEmbed } from "@/components/video/VideoEmbed";
import { browserApi } from "@/lib/browserApi";
import type { UploadedMedia } from "@/lib/mediaUpload";

const MAX_VIDEOS = 10;
/** Ссылки на YouTube, Vimeo, ВКонтакте (vk.com, vkvideo.ru) и Rutube — как проверка в VideoInput старого фронта */
const VIDEO_URL = /^(?:https?:\/\/(?:www\.)?(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch?.+&v=))((\w|-){11})(?:\S+)?|https?:\/\/(?:www\.)?(?:vimeo.com\/)(\d+)|https?:\/\/(?:www\.)?(?:vk\.com\/(?:video|videos)-?\d+_\d+|vkvideo\.ru\/(?:video-?\d+_\d+|video_ext\.php\?(?:[^&]*&)?(?:oid|id)=-?\d+_\d+))|https?:\/\/(?:www\.)?(?:rutube.ru\/video\/)([a-f0-9]{32})(?:\/\S*)?)$/;
const PLUS = "M14 6.667H7.333V0h-.666v6.667H0v.666h6.667V14h.666V7.333H14z";

export interface VolunteerGalleryLabels {
    photos: string;
    photosText: string;
    videos: string;
    videosText: string;
    certificates: string;
    certificatesText: string;
    videoLink: string;
    addVideo: string;
    badUrl: string;
    noVideos: string;
    removeVideo: string;
    videoTitle: string;
    unsupported: string;
    galleryUpdated: string;
    galleryError: string;
    saved: string;
    certificateAdded: string;
    error: string;
    uploader: ImagesUploaderLabels;
    certificateUploader: ImagesUploaderLabels;
}

type Lists = { photos: UploadedMedia[]; videos: string[]; certificates: UploadedMedia[] };

/**
 * «Фото и видео» волонтёра (VolunteerGalleryPage старого фронта): свои фото,
 * видео по ссылке и дипломы/сертификаты. Каждое изменение сразу сохраняется:
 * PATCH /profile/image-gallery, /profile/video-gallery, /volunteer/certificate.
 * Сервер заменяет список целиком, поэтому сохранения идут по очереди и каждое
 * берёт последний подтверждённый сервером список (две пачки загрузки или
 * удаление во время загрузки не затирают друг друга); пока идёт сохранение,
 * удалять нельзя.
 */
export function VolunteerGallery({ labels }: { labels: VolunteerGalleryLabels }) {
    const session = useSession();
    const profile = session.profile;
    const inputId = useId();
    const [lists, setLists] = useState<Lists | null>(null);
    const [link, setLink] = useState("");
    const [saving, setSaving] = useState(0);
    const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
    /** Последние подтверждённые сервером списки — от них считается следующее сохранение */
    const confirmed = useRef<Lists | null>(null);
    const queue = useRef<Promise<unknown>>(Promise.resolve());

    useEffect(() => {
        if (!profile || confirmed.current) return;
        const initial: Lists = {
            photos: profile.galleryImages ?? [],
            videos: profile.videoGallery ?? [],
            certificates: profile.volunteer?.certificates ?? [],
        };
        confirmed.current = initial;
        setLists(initial);
    }, [profile]);

    if (!lists) return <div className="max-w-[880px]"><Spinner /></div>;
    const { photos, videos, certificates } = lists;

    const api = () => browserApi(session.token);
    const say = (text: string, ok: boolean) => setMessage({ text, ok });
    const errorText = (error: unknown, fallback: string) => {
        const { detail, message: text } = (typeof error === "object" && error ? error : {}) as { detail?: unknown; message?: unknown };
        return typeof detail === "string" ? detail : typeof text === "string" ? text : fallback;
    };

    /**
     * Сохранить список: change получает последний подтверждённый список и
     * возвращает новый (или null — сохранять нечего). Сохранения — по очереди.
     */
    const save = <K extends keyof Lists>(key: K, change: (current: Lists[K]) => Lists[K] | null, request: (next: Lists[K]) => Promise<{ error?: unknown }>) => {
        setSaving((value) => value + 1);
        const run = queue.current.then(async () => {
            const current = confirmed.current;
            const next = current ? change(current[key]) : null;
            if (!current || !next) return { ok: false, error: null };
            setMessage(null);
            const { error } = await request(next).catch(() => ({ error: true }));
            if (error) return { ok: false, error };
            confirmed.current = { ...confirmed.current ?? current, [key]: next };
            setLists(confirmed.current);
            return { ok: true, error: null };
        }).finally(() => setSaving((value) => value - 1));
        queue.current = run.catch(() => undefined);
        return run;
    };

    const savePhotos = async (change: (current: UploadedMedia[]) => UploadedMedia[]) => {
        const { ok, error } = await save("photos", change, (next) => api().PATCH("/api/v1/profile/image-gallery", { body: { galleryImageIds: next.map((image) => image.id) } }));
        if (ok) say(labels.galleryUpdated, true);
        else if (error) say(labels.galleryError, false);
    };

    const saveCertificates = async (change: (current: UploadedMedia[]) => UploadedMedia[], notify: boolean) => {
        const { ok, error } = await save("certificates", change, (next) => api().PATCH("/api/v1/volunteer/certificate", { body: { certificateIds: next.map((file) => file.id) } }));
        if (ok && notify) say(labels.certificateAdded, true);
        else if (error) say(labels.error, false);
    };

    const saveVideos = async (change: (current: string[]) => string[] | null) => {
        const { ok, error } = await save("videos", change, (next) => api().PATCH("/api/v1/profile/video-gallery", { body: { videoGallery: next } }));
        if (ok) say(labels.saved, true);
        else if (error) say(errorText(error, labels.error), false);
        return ok;
    };

    const busy = saving > 0;
    const invalid = !!link && !VIDEO_URL.test(link);
    const addVideo = async (event: FormEvent) => {
        event.preventDefault();
        if (!link || invalid || busy || videos.length >= MAX_VIDEOS) return;
        const url = link;
        if (await saveVideos((current) => (current.length >= MAX_VIDEOS ? null : [...current, url]))) setLink("");
    };
    const removeVideo = (index: number, url: string) => void saveVideos((current) => (current[index] === url ? current.filter((_, i) => i !== index) : null));

    const title = (text: string, description: string, first = false) => (
        <div className={first ? "" : "mt-[30px]"}>
            <h2 className="text-[1.625rem] leading-8 font-normal">{text}</h2>
            <p className="mt-[30px]">{description}</p>
        </div>
    );

    return (
        <div className="max-w-[880px]">
            <Toast text={message?.text ?? null} ok={message?.ok} onClose={() => setMessage(null)} />
            {title(labels.photos, labels.photosText, true)}
            <div className="mt-[30px]">
                <ImagesUploader
                    items={photos}
                    token={session.token}
                    labels={labels.uploader}
                    removeDisabled={busy}
                    onUpload={(media) => savePhotos((current) => [...current, ...media])}
                    onDelete={(id) => void savePhotos((current) => current.filter((image) => image.id !== id))}
                    onError={(text) => text && say(text, false)}
                />
            </div>
            {title(labels.videos, labels.videosText)}
            <form onSubmit={addVideo} className="max-w-[1200px]">
                <div className="mt-10">
                    <label htmlFor={inputId} className="text-[14px] text-caption">{labels.videoLink}</label>
                    <div className="mt-[5px] flex gap-5 down-lg:flex-wrap">
                        <div className="w-full">
                            <input
                                id={inputId}
                                type="url"
                                value={link}
                                placeholder={labels.videoLink}
                                aria-invalid={invalid}
                                onChange={(event) => setLink(event.target.value)}
                                className="box-border max-h-11 w-full rounded-[0.625rem] border border-[#82949F] p-3.5 text-[1rem] font-normal outline-none"
                            />
                            {invalid && <p role="alert" className="mt-[5px] text-[red]">{labels.badUrl}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={invalid || busy || !link || videos.length >= MAX_VIDEOS}
                            className="group inline-flex max-h-11 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-caption bg-primary px-5 py-[15px] text-[14px] whitespace-nowrap text-white hover:text-black disabled:cursor-not-allowed disabled:bg-field disabled:text-caption down-lg:w-full"
                        >
                            <svg aria-hidden viewBox="0 0 14 14" className="mr-2.5 h-3.5 w-3.5 fill-white group-hover:fill-black group-disabled:fill-caption"><path d={PLUS} /></svg>
                            {labels.addVideo}
                        </button>
                    </div>
                </div>
                <div className="mt-10 flex min-h-[200px] w-full flex-wrap gap-5">
                    {videos.length ? videos.map((url, index) => (
                        <div key={`${index}-${url}`} className="flex gap-2.5">
                            <div className="w-[320px] max-w-full">
                                <VideoEmbed url={url} height={180} title={labels.videoTitle} unsupported={labels.unsupported} />
                            </div>
                            <button type="button" aria-label={labels.removeVideo} disabled={busy} onClick={() => removeVideo(index, url)} className="mb-auto flex cursor-pointer items-center justify-center p-[5px] font-[sans-serif] disabled:cursor-wait">✖</button>
                        </div>
                    )) : (
                        <div className="flex w-full items-center justify-center text-center">
                            <h4 className="font-bold">{labels.noVideos}</h4>
                        </div>
                    )}
                </div>
            </form>
            {title(labels.certificates, labels.certificatesText)}
            <div className="mt-[30px]">
                <ImagesUploader
                    items={certificates}
                    token={session.token}
                    onlyImages={false}
                    labels={labels.certificateUploader}
                    removeDisabled={busy}
                    onUpload={(media) => saveCertificates((current) => [...current, ...media], true)}
                    onDelete={(id) => void saveCertificates((current) => current.filter((file) => file.id !== id), false)}
                    onError={(text) => say(text ?? labels.error, false)}
                />
            </div>
        </div>
    );
}
