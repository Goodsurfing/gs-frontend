"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

/**
 * «Прогресс по курсу» (CourseProgressBar старого фронта): шкала по урокам,
 * отметка — на последнем пройденном. Страница курса общая для всех, поэтому
 * пройденные уроки вошедшего дозапрашиваются в браузере; у гостя — ноль.
 * В старом фронте это был ползунок MUI, который можно было двигать без
 * всякого смысла; здесь — только индикатор, внешне такой же.
 */
export function CourseProgress({ courseId, total, title, lessonLabel, doneLabel }: {
    courseId: string;
    total: number;
    title: string;
    /** «урок» после номера на шкале */
    lessonLabel: string;
    /** Подпись над отметкой: «{n} пройдено» с нужной формой слова «урок» */
    doneLabel: { one: string; few: string; many: string };
}) {
    const session = useSession();
    const [finished, setFinished] = useState(0);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        browserApi(session.token).GET("/api/v1/course/{id}", { params: { path: { id: courseId } } })
            .then(({ data }) => {
                if (!cancelled && data) setFinished(Math.min(data.courseProgressNumber?.length ?? 0, total));
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, courseId, total]);

    const step = 100 / total;
    const marks = Array.from({ length: total }, (_, index) => ({
        value: (index + 0.5) * step,
        // Длинные курсы — подпись у каждого пятого урока
        label: total <= 15 || (index + 1) % 5 === 0 ? `${index + 1} ${lessonLabel}` : "",
    }));
    const value = finished === 0 ? 0 : finished === total ? 100 : marks[finished - 1]?.value ?? 0;
    const word = finished % 10 === 1 && finished % 100 !== 11 ? doneLabel.one
        : [2, 3, 4].includes(finished % 10) && ![12, 13, 14].includes(finished % 100) ? doneLabel.few
            : doneLabel.many;

    return (
        <div className="w-full rounded-[10px] border border-caption py-5">
            <h2 className="text-center text-[26px] leading-[120%] font-normal">{title}</h2>
            <div className="px-[60px]">
                <div
                    role="progressbar"
                    aria-label={title}
                    aria-valuemin={0}
                    aria-valuemax={total}
                    aria-valuenow={finished}
                    aria-valuetext={`${finished} ${word}`}
                    title={`${finished} ${word}`}
                    className="relative mb-5 box-content inline-block h-1 w-full py-[13px] font-[Roboto,Helvetica,Arial,sans-serif] text-primary"
                >
                    <span className="absolute top-1/2 block h-[inherit] w-full -translate-y-1/2 rounded-[inherit] bg-black opacity-38" />
                    <span className="absolute top-1/2 left-0 block h-[inherit] -translate-y-1/2 rounded-[inherit] border border-current bg-current" style={{ width: `${value}%` }} />
                    {marks.map((mark) => (
                        <span key={mark.value}>
                            <span className="absolute top-1/2 h-0.5 w-0.5 -translate-x-px -translate-y-1/2 rounded-[1px] bg-current" style={{ left: `${mark.value}%` }} />
                            {mark.label && (
                                <span
                                    className={`absolute top-[30px] -translate-x-1/2 text-[0.875rem] leading-[1.43] tracking-[0.01071em] whitespace-nowrap ${mark.value <= value ? "text-black/87" : "text-black/60"}`}
                                    style={{ left: `${mark.value}%` }}
                                >
                                    {mark.label}
                                </span>
                            )}
                        </span>
                    ))}
                    <span className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),0_2px_2px_0_rgba(0,0,0,0.14),0_1px_5px_0_rgba(0,0,0,0.12)]" style={{ left: `${value}%` }} />
                </div>
            </div>
        </div>
    );
}
