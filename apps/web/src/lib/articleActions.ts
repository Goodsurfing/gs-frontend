import { browserApi } from "./browserApi";

/** Виды материалов со страницей, лайками и комментариями */
export type ArticleKind = "news" | "blog" | "journal" | "video";

export interface ArticleComment { id: string; authorId: string; authorName: string; authorAvatar?: string; text: string; date: string }

type ApiComment = {
    id?: string | number;
    description?: string;
    created?: string;
    author?: { id?: string; firstName?: string | null; lastName?: string | null; image?: { contentUrl?: string; thumbnails?: { small?: string } | null } | null } | null;
};

const toComment = (item: ApiComment, anonymous: string): ArticleComment => ({
    id: String(item.id ?? `${item.author?.id}-${item.created}-${item.description}`),
    authorId: item.author?.id ?? "",
    authorName: `${item.author?.firstName || ""} ${item.author?.lastName || ""}`.trim() || anonymous,
    authorAvatar: item.author?.image?.thumbnails?.small || item.author?.image?.contentUrl || undefined,
    text: item.description ?? "",
    date: item.created ?? "",
});

/** Поставить или снять лайк (PATCH …/like/{id}) */
export async function toggleLike(kind: ArticleKind, id: string, token?: string): Promise<boolean> {
    const api = browserApi(token);
    const path = { params: { path: { id } } } as never;
    const result = kind === "news" ? await api.PATCH("/api/v1/news/like/{id}", path)
        : kind === "blog" ? await api.PATCH("/api/v1/blog/like/{id}", path)
            : kind === "journal" ? await api.PATCH("/api/v1/journal/like/{id}", path)
                : await api.PATCH("/api/v1/video/like/{id}", path);
    return !result.error;
}

/** Комментарии постранично */
export async function loadComments(kind: ArticleKind, id: string, page: number, limit: number, anonymous: string) {
    const api = browserApi();
    const query = { page, limit };
    const result = kind === "news" ? await api.GET("/api/v1/review-news/list/{newsId}", { params: { path: { newsId: id }, query } } as never)
        : kind === "blog" ? await api.GET("/api/v1/review-blog/list/{blogId}", { params: { path: { blogId: id }, query } } as never)
            : kind === "journal" ? await api.GET("/api/v1/review-journal/list/{journalId}", { params: { path: { journalId: id }, query } } as never)
                : await api.GET("/api/v1/review-video/list/{videoId}", { params: { path: { videoId: id }, query } } as never);
    const data = result.data as { data?: ApiComment[]; pagination?: { total?: number } } | undefined;
    if (!data) throw new Error("comments");
    return { items: (data.data ?? []).map((item) => toComment(item, anonymous)), total: data.pagination?.total ?? 0 };
}

/** Оставить комментарий от имени вошедшего */
export async function sendComment(kind: ArticleKind, id: string, description: string, token?: string): Promise<boolean> {
    const api = browserApi(token);
    const result = kind === "news" ? await api.POST("/api/v1/review-news", { body: { newsId: id, description } } as never)
        : kind === "blog" ? await api.POST("/api/v1/review-blog", { body: { blogId: Number(id), description } } as never)
            : kind === "journal" ? await api.POST("/api/v1/review-journal", { body: { journalId: id, description } } as never)
                : await api.POST("/api/v1/review-video", { body: { videoId: id, description } } as never);
    return !result.error;
}
