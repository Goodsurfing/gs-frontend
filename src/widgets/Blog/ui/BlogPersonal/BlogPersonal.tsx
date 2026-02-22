import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import {
    ArticleContent, ArticleHeader, ArticleShare, Navigation,
} from "@/features/Article";
import { getNewsPageUrl, getNewsPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { CommentWidget } from "@/widgets/Article";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MAIN_URL } from "@/shared/constants/api";
import {
    blogReviewsAdapter,
    GetReviewBlog,
    useCreateReviewBlogMutation, useGetBlogByIdQuery,
    useLazyGetReviewsBlogQuery, usePutLikeBlogMutation,
} from "@/entities/Blog";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { useGetFullName } from "@/shared/lib/getFullName";
import styles from "./BlogPersonal.module.scss";

interface BlogPersonalProps {
    blogId: number;
}

const VISIBLE_COUNT = 10;

export const BlogPersonal: FC<BlogPersonalProps> = (props) => {
    const { blogId } = props;
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [page, setPage] = useState<number>(1);
    const [reviews, setReviews] = useState<GetReviewBlog[]>([]);
    const { getFullName } = useGetFullName();

    const { data, isLoading } = useGetBlogByIdQuery({ id: blogId, lang: locale });
    const articleContent = data?.description ?? "<p>Данная статья пустая</p>";
    const [putLike] = usePutLikeBlogMutation();
    const [createBlog] = useCreateReviewBlogMutation();
    const [getReviews, { data: reviewsData }] = useLazyGetReviewsBlogQuery();

    const fetchReviews = useCallback(async (pageItem: number) => {
        try {
            await getReviews({
                blogId,
                limit: VISIBLE_COUNT,
                page: pageItem,
            }).unwrap();
        } catch {
            setToast({
                text: "Произошла ошибка при подгрузке комментариев",
                type: HintType.Error,
            });
        }
    }, [getReviews, blogId]);

    useEffect(() => {
        fetchReviews(page);
    }, [fetchReviews, page]);

    useEffect(() => {
        if (reviewsData?.data) {
            setReviews((prev) => {
                if (page === 1) {
                    return [...reviewsData.data];
                }
                return [...prev, ...reviewsData.data];
            });
        }
    }, [reviewsData, page]);

    const onLike = async () => {
        setToast(undefined);
        try {
            await putLike(blogId).unwrap();
        } catch {
            setToast({
                text: "Произошла ошибка",
                type: HintType.Error,
            });
        }
    };

    const onComment = async (description: string) => {
        try {
            await createBlog({ blogId, description }).unwrap();
            await fetchReviews(1);
        } catch {
            setToast({
                text: "Произошла ошибка",
                type: HintType.Error,
            });
        }
    };

    const handleShowNext = () => {
        setPage((prev) => prev + 1);
    };

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            {data && (
                <Navigation
                    breadcrumbs={[
                        { name: "Новости", link: getNewsPageUrl(locale) },
                        { name: data.name },
                    ]}
                    className={styles.navigation}
                />
            )}
            <div className={styles.articleWrapper}>
                <ArticleHeader
                    className={styles.articleHeader}
                    title={data?.name ?? ""}
                    authorId={data?.author.id}
                    authorAvatar={getMediaContent(data?.author.image?.thumbnails?.small)}
                    authorName={getFullName(data?.author.firstName, data?.author.lastName)}
                    category={data?.blogCategoryResult.name}
                    categoryColor={data?.blogCategoryResult.color}
                    date={data?.created ?? ""}
                    likes={data?.likeCount ?? 0}
                    reviews={data?.reviewCount ?? 0}
                    onLike={onLike}
                    locale={locale}
                />
                <ArticleContent className={styles.content} content={articleContent} />
                <ArticleShare
                    className={styles.shareBlock}
                    url={`${MAIN_URL}${getNewsPersonalPageUrl(locale, String(data?.id))}`}
                />
            </div>
            <div className={styles.commentWrapper}>
                <CommentWidget
                    commentsCount={data?.reviewCount ?? 0}
                    onSend={onComment}
                    comments={blogReviewsAdapter(reviews)}
                    onNextComments={handleShowNext}
                    total={reviewsData?.pagination.total}
                    locale={locale}
                />
            </div>
        </div>
    );
};
