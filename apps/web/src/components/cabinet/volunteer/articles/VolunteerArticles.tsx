"use client";

import type { components } from "@goodsurfing/api";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useCallback, useEffect, useState } from "react";

import { ArticleCard } from "@/components/list/ArticleCard";
import { PageButtons } from "@/components/list/PageButtons";
import { useSession } from "@/components/session/SessionProvider";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";

type Article = components["schemas"]["ListResult2"];
type List = { items: Article[]; total: number };

const PER_PAGE = 10;

export interface VolunteerArticlesLabels {
    drafts: string;
    edit: string;
    publish: string;
    remove: string;
    actions: string;
    deleted: string;
    deleteError: string;
    published: string;
    publishError: string;
    empty: string;
    create: string;
    pagination: { prev: string; next: string; page: string };
}

/**
 * «Мои статьи» волонтёра (VolunteerArticlesPage старого фронта): опубликованные
 * и черновики — каждые по 10 со своей пагинацией; у карточки меню «⋯»:
 * редактировать, опубликовать (черновик), удалить. Нет ни одной — приглашение
 * создать первую.
 */
export function VolunteerArticles({ hrefs, labels }: {
    hrefs: { article: string; edit: string; create: string };
    labels: VolunteerArticlesLabels;
}) {
    const session = useSession();
    const [page, setPage] = useState(1);
    const [draftPage, setDraftPage] = useState(1);
    const [published, setPublished] = useState<List | null>(null);
    const [drafts, setDrafts] = useState<List | null>(null);
    // Увеличивается после удаления или публикации — оба списка перечитываются
    const [version, setVersion] = useState(0);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const closeToast = useCallback(() => setToast(null), []);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        const load = (isActive: boolean, target: number, setList: (list: List) => void) => browserApi(session.token)
            .GET("/api/v1/blog", { params: { query: { page: target, limit: PER_PAGE, isAuth: true, isActive } } })
            .catch(() => ({ data: undefined }))
            .then(({ data }) => !cancelled && setList({ items: data?.data ?? [], total: data?.pagination?.total ?? 0 }));
        void load(true, page, setPublished);
        void load(false, draftPage, setDrafts);
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, page, draftPage, version]);

    const remove = async (id: number) => {
        const { error } = await browserApi(session.token).DELETE("/api/v1/blog/{id}", { params: { path: { id } } }).catch(() => ({ error: true }));
        setToast(error ? { text: labels.deleteError, ok: false } : { text: labels.deleted, ok: true });
        if (!error) setVersion((value) => value + 1);
    };
    const publish = async (id: number) => {
        const { error } = await browserApi(session.token).PATCH("/api/v1/blog/{id}/toggle-active", { params: { path: { id } }, body: { isActive: true } }).catch(() => ({ error: true }));
        setToast(error ? { text: labels.publishError, ok: false } : { text: labels.published, ok: true });
        if (!error) setVersion((value) => value + 1);
    };

    const grid = (items: Article[]) => (
        <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(375px,1fr))] gap-5">
            {items.map((article) => {
                const id = Number(article.id);
                return (
                    <div key={id} className="relative">
                        <ArticleCard
                            href={hrefs.article.replace("{slug}", article.slug)}
                            image={mediaUrl(article.image, "large")}
                            name={article.name}
                            created={article.created}
                            tags={article.blogCategories}
                            likeCount={article.likeCount}
                            reviewCount={article.reviewCount}
                        />
                        <DropdownMenu.Root modal={false}>
                            <DropdownMenu.Trigger aria-label={labels.actions} className="absolute top-2.5 right-[15px] flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-white shadow-[6px_8px_16px_0_rgba(34,60,80,0.2)]">
                                <svg aria-hidden width="19" height="4" viewBox="0 0 20 4" fill="#8494A1" className="block overflow-visible">
                                    <path d="M15.625 2a1.875 1.875 0 1 1 3.75 0 1.875 1.875 0 0 1-3.75 0Zm-7.5 0a1.875 1.875 0 1 1 3.75 0 1.875 1.875 0 0 1-3.75 0Zm-7.5 0a1.875 1.875 0 1 1 3.75 0 1.875 1.875 0 0 1-3.75 0Z" />
                                </svg>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content side="left" align="start" sideOffset={0} className="z-[4] flex w-[190px] animate-fade-in flex-col gap-2 bg-white p-3.5">
                                    {[
                                        { text: labels.edit, href: hrefs.edit.replace("{id}", String(id)) },
                                        ...(article.isActive ? [] : [{ text: labels.publish, onSelect: () => void publish(id) }]),
                                        { text: labels.remove, onSelect: () => void remove(id) },
                                    ].map((item) => (
                                        <DropdownMenu.Item
                                            key={item.text}
                                            asChild={!!item.href}
                                            onSelect={item.onSelect}
                                            className="cursor-pointer p-0 text-left text-[14px] font-medium text-ink no-underline outline-none transition-all duration-300 hover:text-primary data-[highlighted]:text-primary"
                                        >
                                            {item.href ? <a href={item.href}>{item.text}</a> : <span>{item.text}</span>}
                                        </DropdownMenu.Item>
                                    ))}
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    </div>
                );
            })}
        </div>
    );
    const pages = (list: List) => Math.max(1, Math.ceil(list.total / PER_PAGE));

    return (
        <div>
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={closeToast} />
            {published?.total === 0 && drafts?.total === 0 && (
                <div className="mt-5 flex w-fit flex-col gap-[15px]">
                    <p>{labels.empty}</p>
                    <a href={hrefs.create} className="inline-block rounded-[10px] bg-primary px-[50px] py-3.5 text-center text-[1rem] leading-[1.375rem] text-white no-underline transition-all hover:bg-primary-hover">
                        {labels.create}
                    </a>
                </div>
            )}
            {published === null ? <Spinner /> : (
                <div className="flex flex-col gap-5">
                    {grid(published.items)}
                    {published.total !== 0 && (
                        <div className="flex py-2.5"><PageButtons page={page} count={pages(published)} onChange={setPage} labels={labels.pagination} /></div>
                    )}
                </div>
            )}
            {drafts === null ? <Spinner /> : drafts.total !== 0 && (
                <section className="mt-[60px]">
                    <h2 className="text-[1.5em] font-bold">{labels.drafts}</h2>
                    <div className="flex flex-col gap-5">
                        {grid(drafts.items)}
                        <div className="flex py-2.5"><PageButtons page={draftPage} count={pages(drafts)} onChange={setDraftPage} labels={labels.pagination} /></div>
                    </div>
                </section>
            )}
        </div>
    );
}
