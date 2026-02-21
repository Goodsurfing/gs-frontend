import { ArticleCardType } from "@/entities/Article";
import { GetBlogList, GetReviewBlog } from "../model/types/blogSchema";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Comments } from "@/features/Article";
import { getFullName } from "@/shared/lib/getFullName";

export const blogArticleCardAdapter = (
    data: GetBlogList[],
): ArticleCardType[] => data.map((blog) => {
    const {
        id, name, image, created, blogCategory, likeCount,
        reviewCount,
    } = blog;
    return {
        id: String(id),
        name,
        image: getMediaContent(image.thumbnails?.large),
        category: blogCategory,
        created,
        likeCount,
        reviewCount,
    };
});

export const blogReviewsAdapter = (data: GetReviewBlog[]): Comments[] => data.map((value) => {
    const { author, created, description } = value;
    return {
        authorId: author.id,
        authorAvatar: getMediaContent(author?.image?.contentUrl),
        authorName: getFullName(author.firstName, author.lastName),
        comment: description,
        date: created,
    };
});
