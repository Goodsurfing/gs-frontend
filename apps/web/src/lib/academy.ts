import "server-only";

import type { Locale } from "@/i18n/config";

import { serverApi } from "./api";
import { isUuid } from "./entityId";
import { isClientError } from "@/lib/apiUnavailable";

/** Курсов и уроков на странице — как в старом фронте */
export const ACADEMY_PAGE_SIZE = 10;

const TIMEOUT_MS = 5000;

const fullName = (person?: { firstName?: string | null; lastName?: string | null } | null) => `${person?.firstName || ""} ${person?.lastName || ""}`.trim();

/** Курсы академии, свежие сверху (sort:desc, как CoursesList старого фронта). Ошибка — null. */
export async function getCourses(locale: Locale, page: number) {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/course", {
            params: { query: { page, limit: ACADEMY_PAGE_SIZE, sort: "sort:desc" } },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!data) return null;
        return {
            items: (data.data ?? []).map((course) => ({ ...course, authorName: fullName(course.author) })),
            total: data.pagination?.total ?? 0,
        };
    } catch {
        return null;
    }
}

async function fetchCourse(locale: Locale, id: string) {
    const { data, response } = await serverApi(locale).GET("/api/v1/course/{id}", {
        params: { path: { id } },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return { data, status: response.status };
}

export type CourseResult =
    | { kind: "ok"; course: NonNullable<Awaited<ReturnType<typeof fetchCourse>>["data"]> & { authorName: string } }
    | { kind: "notFound" }
    | { kind: "error" };

/**
 * Курс без данных о прогрессе (страница общая для всех; прогресс дозапрашивает браузер).
 * Нет курса (id не UUID или ответ 4xx) — notFound, сбой API — error.
 */
export async function getCourse(locale: Locale, id: string): Promise<CourseResult> {
    if (!isUuid(id)) return { kind: "notFound" };
    try {
        const { data, status } = await fetchCourse(locale, id);
        if (data) return { kind: "ok", course: { ...data, authorName: fullName(data.author) } };
        return { kind: isClientError(status) ? "notFound" : "error" };
    } catch {
        return { kind: "error" };
    }
}

/** Уроки курса постранично. Ошибка — null. */
export async function getLessons(locale: Locale, courseId: string, page: number) {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/video-course/list/{courseId}", {
            params: { path: { courseId }, query: { page, limit: ACADEMY_PAGE_SIZE } },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!data) return null;
        return { items: data.data ?? [], total: data.pagination?.total ?? 0 };
    } catch {
        return null;
    }
}

/** Отзывов к уроку на странице — как в старом фронте; то же число в components/academy/LessonReviews */
const LESSON_REVIEWS_PAGE_SIZE = 5;

/** Первые отзывы к уроку (они публичные, сам урок — только вошедшим). Ошибка — null. */
export async function getLessonReviews(locale: Locale, lessonId: string) {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/review-video-course/list/{videoCourseId}", {
            params: { path: { videoCourseId: lessonId }, query: { page: 1, limit: LESSON_REVIEWS_PAGE_SIZE } },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!data) return null;
        return {
            items: (data.data ?? []).map((item) => ({
                author: { id: item.author.id, firstName: item.author.firstName, lastName: item.author.lastName, image: item.author.image ?? null },
                description: item.description,
                rating: Number(item.rating),
            })),
            total: data.pagination?.total ?? 0,
        };
    } catch {
        return null;
    }
}
