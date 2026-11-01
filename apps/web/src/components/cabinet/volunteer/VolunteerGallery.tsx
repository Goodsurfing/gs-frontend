"use client";

import { type FormEvent, useEffect, useId, useState } from "react";

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

/**
 * «Фото и видео» волонтёра (VolunteerGalleryPage старого фронта): свои фото,
 * видео по ссылке и дипломы/сертификаты. Каждое изменение сразу сохраняется:
 * PATCH /profile/image-gallery, /profile/video-gallery, /volunteer/certificate.
 */
export function VolunteerGallery({ labels }: { labels: VolunteerGalleryLabels }) {
    const session = useSession();
    const profile = session.profile;
    const inputId = useId();
    const [photos, setPhotos] = useState<UploadedMedia[] | null>(null);
    const [videos, setVideos] = useState<string[]>([]);
    const [certificates, setCertificates] = useState<UploadedMedia[]>([]);
    const [link, setLink] = useState("");
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

    useEffect(() => {
        if (!profile || photos) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- профиль приходит из сессии в браузере
        setPhotos(profile.galleryImages ?? []);
        setVideos(profile.videoGallery ?? []);
        setCertificates(profile.volunteer?.certificates ?? []);
    }, [profile, photos]);

    if (!photos) return <div className="max-w-[880px]"><Spinner /></div>;

    const api = () => browserApi(session.token);
    const say = (text: string, ok: boolean) => setMessage({ text, ok });

    const savePhotos = async (next: UploadedMedia[]) => {
        setMessage(null);
        const { error } = await api().PATCH("/api/v1/profile/image-gallery", { body: { galleryImageIds: next.map((image) => image.id) } }).catch(() => ({ error: true }));
        if (error) {
            say(labels.galleryError, false);
            return;
        }
        setPhotos(next);
        say(labels.galleryUpdated, true);
    };

    const saveCertificates = async (next: UploadedMedia[], notify: boolean) => {
        setMessage(null);
        const { error } = await api().PATCH("/api/v1/volunteer/certificate", { body: { certificateIds: next.map((file) => file.id) } }).catch(() => ({ error: true }));
        if (error) {
            say(labels.error, false);
            return;
        }
        setCertificates(next);
        if (notify) say(labels.certificateAdded, true);
    };

    const saveVideos = async (next: string[]) => {
        setMessage(null);
        setBusy(true);
        const { error } = await api().PATCH("/api/v1/profile/video-gallery", { body: { videoGallery: next } }).catch(() => ({ error: true }));
        setBusy(false);
        if (error) {
            const { detail, message: text } = (typeof error === "object" ? error : {}) as { detail?: unknown; message?: unknown };
            say(typeof detail === "string" ? detail : typeof text === "string" ? text : labels.error, false);
            return false;
        }
        setVideos(next);
        say(labels.saved, true);
        return true;
    };

    const invalid = !!link && !VIDEO_URL.test(link);
    const addVideo = async (event: FormEvent) => {
        event.preventDefault();
        if (!link || invalid || videos.length >= MAX_VIDEOS) return;
        if (await saveVideos([...videos, link])) setLink("");
    };

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
                    onUpload={(media) => savePhotos([...photos, ...media])}
                    onDelete={(id) => void savePhotos(photos.filter((image) => image.id !== id))}
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
                            <button type="button" aria-label={labels.removeVideo} onClick={() => void saveVideos(videos.filter((_, i) => i !== index))} className="mb-auto flex cursor-pointer items-center justify-center p-[5px] font-[sans-serif]">✖</button>
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
                    onUpload={(media) => saveCertificates([...certificates, ...media], true)}
                    onDelete={(id) => void saveCertificates(certificates.filter((file) => file.id !== id), false)}
                    onError={(text) => say(text ?? labels.error, false)}
                />
            </div>
        </div>
    );
}
