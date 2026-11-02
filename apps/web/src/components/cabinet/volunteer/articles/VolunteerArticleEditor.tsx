"use client";

import { useCallback, useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";

import { type ArticleFields, ArticleForm, type ArticleFormLabels, EMPTY_ARTICLE } from "./ArticleForm";

export interface VolunteerArticleEditorLabels {
    form: ArticleFormLabels;
    createError: string;
    updateError: string;
    published: string;
    drafted: string;
    uploadError: string;
    /** Статья для правки не загрузилась */
    loadError: string;
}

/**
 * Новая статья (VolunteerCreateArticle старого фронта: после сохранения — к
 * списку «Мои статьи») или правка своей (VolunteerArticleInfo: остаёмся на
 * странице, сообщение «опубликована» или «в черновиках»).
 */
export function VolunteerArticleEditor({ locale, articleId, listHref, labels }: {
    locale: Locale;
    /** Нет — новая статья */
    articleId?: number;
    listHref: string;
    labels: VolunteerArticleEditorLabels;
}) {
    const session = useSession();
    // false — статья не загрузилась: форму не показываем, иначе сохранение затрёт статью пустой
    const [initial, setInitial] = useState<ArticleFields | false | null>(articleId ? null : EMPTY_ARTICLE);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const closeToast = useCallback(() => setToast(null), []);

    useEffect(() => {
        if (!articleId || session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token).GET("/api/v1/blog/{id}", { params: { path: { id: articleId }, query: { lang: locale } } })
            .then(({ data, response }) => {
                if (cancelled) return;
                setInitial(response.ok && data ? {
                    image: data.image ?? null,
                    name: data.name,
                    categoryIds: data.blogCategoryResults.map((category) => category.id),
                    description: data.description,
                } : false);
            })
            .catch(() => !cancelled && setInitial(false));
        return () => {
            cancelled = true;
        };
    }, [articleId, locale, session.status, session.token]);

    const save = async (fields: ArticleFields, isActive: boolean) => {
        setToast(null);
        setBusy(true);
        const body = { name: fields.name, description: fields.description, imageId: fields.image?.id ?? "", isActive, categoryIds: fields.categoryIds };
        const api = browserApi(session.token);
        // Успех — по статусу ответа: у не-2xx с пустым телом openapi-fetch даёт error undefined
        const ok = await (articleId
            ? api.PATCH("/api/v1/blog/{id}", { params: { path: { id: articleId } }, body })
            : api.POST("/api/v1/blog", { body })
        ).then(({ response }) => response.ok, () => false);
        if (!ok) {
            setBusy(false);
            setToast({ text: articleId ? labels.updateError : labels.createError, ok: false });
            return;
        }
        if (articleId) {
            setBusy(false);
            setToast({ text: isActive ? labels.published : labels.drafted, ok: true });
        } else {
            // Кнопки остаются выключенными до ухода со страницы — повторное нажатие не создаст вторую статью
            window.location.assign(listHref);
        }
    };

    return (
        <>
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={closeToast} />
            {initial === null ? <Spinner className="mt-10" /> : initial === false ? (
                <p role="alert" className="mt-10 text-[16px] text-error-field">{labels.loadError}</p>
            ) : (
                <ArticleForm
                    key={articleId ?? "new"}
                    locale={locale}
                    initial={initial}
                    busy={busy}
                    labels={labels.form}
                    onSubmit={(fields, isActive) => void save(fields, isActive)}
                    onUploadError={() => setToast({ text: labels.uploadError, ok: false })}
                    onMessage={(text) => setToast({ text, ok: false })}
                />
            )}
        </>
    );
}
