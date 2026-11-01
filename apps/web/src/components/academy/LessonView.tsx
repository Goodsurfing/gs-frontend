"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { VideoEmbed } from "@/components/video/VideoEmbed";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";

import { type LessonReview, LessonReviews, type LessonReviewsLabels } from "./LessonReviews";

export interface LessonLabels extends LessonReviewsLabels {
    courses: string;
    materials: string;
    prev: string;
    next: string;
    videoForUsers: string;
    signIn: string;
    noVideo: string;
    unsupported: string;
    loadError: string;
}

interface Lesson {
    name: string;
    description: string;
    url?: string | null;
    prevVideoId?: string | null;
    nextVideoId?: string | null;
    isCanReview?: boolean;
    course: { id: string; name: string };
    files?: { id: string; contentUrl: string; name?: string | null }[];
}

/** Имя файла: из API или из адреса (getAttachmentName старого фронта) */
function fileName(file: { contentUrl: string; name?: string | null }) {
    if (file.name) return file.name;
    const last = file.contentUrl.split("/").pop();
    if (!last) return "Файл";
    try {
        return decodeURIComponent(last);
    } catch {
        return last;
    }
}

const card = "mt-[30px] rounded-[20px] bg-white shadow-[0_5px_20px_0_rgba(14,29,39,0.05)] max-[1200px]:p-5";

/**
 * Урок академии (LessonPersonal старого фронта). Урок отдаётся только
 * вошедшим, поэтому весь загружается в браузере с токеном: гость видит
 * приглашение войти. Открытие урока засчитывается в прогресс курса.
 */
export function LessonView({ lessonId, reviews, coursesHref, courseHref, lessonHref, signInHref, volunteerHref, labels }: {
    lessonId: string;
    /** Первая страница отзывов с сервера */
    reviews: { items: LessonReview[]; total: number } | null;
    coursesHref: string;
    /** Адреса курса, урока и волонтёра — с {id} */
    courseHref: string;
    lessonHref: string;
    signInHref: string;
    volunteerHref: string;
    labels: LessonLabels;
}) {
    const session = useSession();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        const api = browserApi(session.token);
        api.GET("/api/v1/video-course/{id}", { params: { path: { id: lessonId } } })
            .then(({ data }) => {
                if (cancelled) return;
                if (data) setLesson(data as Lesson);
                else setFailed(true);
            })
            .catch(() => !cancelled && setFailed(true));
        void api.PATCH("/api/v1/course/recalculate-count/{id}", { params: { path: { id: lessonId } } } as never).catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, lessonId]);

    const files = (lesson?.files ?? []).filter((file) => file.contentUrl);
    const video = "mx-auto my-10 min-h-[415px] w-full max-w-[750px]";

    return (
        <div className="mx-auto max-w-[1180px] pt-[60px] pb-[100px] max-[1200px]:pt-[30px]">
            {lesson && (
                <nav className="max-[1200px]:px-5">
                    <span className="text-[0.875rem] font-medium text-primary">
                        <a href={coursesHref} className="underline decoration-2">{labels.courses}</a>
                        {" / "}
                        <a href={courseHref.replace("{id}", lesson.course.id)} className="underline decoration-2">{lesson.course.name}</a>
                        {" / "}
                        <span>{lesson.name}</span>
                    </span>
                </nav>
            )}
            <article className={`${card} px-[120px] py-[60px]`}>
                {session.status === "guest" && (
                    <div className={`${video} flex flex-col items-center justify-center gap-5 bg-field px-5`}>
                        <p className="text-center">{labels.videoForUsers}</p>
                        <a href={signInHref} className="inline-block rounded-[10px] bg-primary px-[50px] py-3.5 text-center text-[1rem] leading-[1.375rem] text-white transition-colors duration-300 hover:bg-primary-hover">
                            {labels.signIn}
                        </a>
                    </div>
                )}
                {session.status === "user" && failed && <p className="text-center">{labels.loadError}</p>}
                {lesson && (
                    <>
                        <h1 className="text-center text-[2em] font-bold down-sm:text-[24px]">{lesson.name}</h1>
                        <p className="mt-6">{lesson.description}</p>
                        <div className={video}>
                            {lesson.url
                                ? <div className="w-[750px] max-w-full [@media(max-width:1000px)]:w-full"><VideoEmbed url={lesson.url} height={424} title={lesson.name} unsupported={labels.unsupported} /></div>
                                : <p>{labels.noVideo}</p>}
                        </div>
                        {files.length > 0 && (
                            <div className="mt-8 mb-2">
                                <h3 className="mb-3 text-[18px] font-semibold">{labels.materials}</h3>
                                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                                    {files.map((file) => (
                                        <li key={file.id} className="flex items-center">
                                            <a
                                                href={mediaUrl(file)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-[8px] border border-[#e0e0e0] px-4 py-2 text-[15px] break-all text-primary no-underline transition-colors duration-200 hover:bg-[#f5f5f5] hover:underline"
                                            >
                                                {`📎 ${fileName(file)}`}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="flex w-full items-center justify-between gap-[15px]">
                            {lesson.prevVideoId && (
                                <a href={lessonHref.replace("{id}", lesson.prevVideoId)} className="text-primary transition-all duration-300 hover:underline down-sm:text-[14px]">
                                    {`🠐 ${labels.prev}`}
                                </a>
                            )}
                            {lesson.nextVideoId && (
                                <a href={lessonHref.replace("{id}", lesson.nextVideoId)} className={`text-primary transition-all duration-300 hover:underline down-sm:text-[14px] ${lesson.prevVideoId ? "" : "ml-auto"}`}>
                                    {`${labels.next} 🠒`}
                                </a>
                            )}
                        </div>
                    </>
                )}
            </article>
            <div className={`${card} px-[120px] py-10`}>
                <LessonReviews lessonId={lessonId} initial={reviews} canReview={!!lesson?.isCanReview} signInHref={signInHref} volunteerHref={volunteerHref} labels={labels} />
            </div>
        </div>
    );
}
