"use client";

import { useEffect, useState } from "react";

import { ShowNext } from "@/components/offer/ShowNext";
import { useSession } from "@/components/session/SessionProvider";
import { type ArticleComment, type ArticleKind, loadComments, sendComment, toggleLike } from "@/lib/articleActions";

export interface ArticleTexts {
    loginToLike: string;
    loginToComment: string;
    error: string;
    loadError: string;
    comments: string;
    write: string;
    showNext: string;
    anonymous: string;
}

function Toast({ text, onClose }: { text: string | null; onClose: () => void }) {
    useEffect(() => {
        if (!text) return;
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [text, onClose]);
    if (!text) return null;
    return <div role="alert" className="fixed top-5 left-1/2 z-[1000] -translate-x-1/2 rounded-[10px] bg-white px-5 py-3 text-error shadow-lg">{text}</div>;
}

/**
 * Лайк в шапке статьи (ArticleHeader старого фронта): гостю — подсказка,
 * что нужно войти; вошедшему — переключение и новый счётчик.
 */
export function ArticleLikes({ kind, id, likes, reviews, texts }: { kind: ArticleKind; id: string; likes: number; reviews: number; texts: ArticleTexts }) {
    const session = useSession();
    const [count, setCount] = useState(likes);
    const [liked, setLiked] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const like = async () => {
        if (session.status !== "user") {
            setToast(texts.loginToLike);
            return;
        }
        const ok = await toggleLike(kind, id, session.token).catch(() => false);
        if (!ok) {
            setToast(texts.error);
            return;
        }
        setCount((value) => value + (liked ? -1 : 1));
        setLiked(!liked);
    };

    return (
        <div className="flex gap-3">
            <Toast text={toast} onClose={() => setToast(null)} />
            <button type="button" onClick={like} aria-pressed={liked} className="flex cursor-pointer items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                <img src="/web/icons/ui/thumbs-up.svg" alt="likes" className="h-4 w-4" />
                <span className="text-[0.875rem] font-bold">{count}</span>
            </button>
            <div className="flex items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                <img src="/web/icons/ui/comment.svg" alt="comments" className="h-4 w-4" />
                <span className="text-[0.875rem] font-bold">{reviews}</span>
            </div>
        </div>
    );
}

/** Комментарии к статье (CommentWidget старого фронта): по десять, форма для вошедших */
export function ArticleComments({ kind, id, count, volunteerHref, texts }: {
    kind: ArticleKind;
    id: string;
    count: number;
    /** Адрес страницы автора с {id} */
    volunteerHref: string;
    texts: ArticleTexts;
}) {
    const session = useSession();
    const [items, setItems] = useState<ArticleComment[]>([]);
    const [total, setTotal] = useState<number | undefined>();
    const [page, setPage] = useState(1);
    const [text, setText] = useState("");
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        loadComments(kind, id, page, 10, texts.anonymous)
            .then((result) => {
                if (cancelled) return;
                setItems((prev) => (page === 1 ? result.items : [...prev, ...result.items]));
                setTotal(result.total);
            })
            .catch(() => !cancelled && setToast(texts.loadError));
        return () => {
            cancelled = true;
        };
    }, [kind, id, page, texts.anonymous, texts.loadError]);

    const send = async () => {
        if (session.status !== "user") {
            setToast(texts.loginToComment);
            return;
        }
        const value = text;
        setText("");
        const ok = await sendComment(kind, id, value, session.token).catch(() => false);
        if (!ok) {
            setToast(texts.error);
            return;
        }
        const first = await loadComments(kind, id, 1, 10, texts.anonymous).catch(() => null);
        if (first) {
            setItems(first.items);
            setTotal(first.total);
            setPage(1);
        }
    };

    return (
        <div>
            <Toast text={toast} onClose={() => setToast(null)} />
            <div className="text-[.875rem] font-bold">{count} {texts.comments}</div>
            <div>
                <textarea
                    aria-label={texts.write}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    className="mt-2 box-border h-[7.375rem] w-full resize-none rounded-[10px] border border-[#82949F] p-3.5 text-[16px] outline-none"
                />
                <button
                    type="button"
                    onClick={send}
                    className="mt-4 cursor-pointer rounded-[10px] border border-primary px-[100px] py-3 text-[16px] leading-[120%] text-primary transition-all duration-300 hover:bg-primary hover:text-white down-lg:w-full down-lg:px-[15px]"
                >
                    {texts.write}
                </button>
            </div>
            <div className="flex flex-col gap-[15px] py-4">
                {items.map((comment) => (
                    <div key={comment.id} className="flex flex-col gap-2.5">
                        <span>{comment.text}</span>
                        <div className="flex items-center gap-3">
                            <a href={volunteerHref.replace("{id}", comment.authorId)} className="flex items-center gap-2">
                                {comment.authorAvatar
                                    // eslint-disable-next-line @next/next/no-img-element -- аватар
                                    ? <img src={comment.authorAvatar} alt="" className="h-[22px] w-[22px] rounded-full object-cover" />
                                    : <div className="h-[22px] w-[22px] rounded-full bg-field" />}
                                <span className="text-[0.875rem] text-primary">{comment.authorName}</span>
                            </a>
                            <span className="text-[0.75rem] text-caption">/{comment.date}</span>
                        </div>
                    </div>
                ))}
            </div>
            {items.length > 0 && total !== undefined && items.length < total && (
                <ShowNext onClick={() => setPage(page + 1)} label={texts.showNext} />
            )}
        </div>
    );
}
