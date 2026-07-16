import { ArticleCardType } from "@/entities/Article";
import { GetBlogList, GetReviewBlog } from "../model/types/blogSchema";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Comments } from "@/features/Article";
import { getFullName } from "@/shared/lib/getFullName";

export const blogArticleCardAdapter = (
    data: GetBlogList[],
): ArticleCardType[] => data.map((blog) => {
    const {
        id, slug, name, image, created, blogCategories, likeCount,
        reviewCount, isActive,
    } = blog;
    return {
        id: String(id),
        slug,
        name,
        image: getMediaContent(image.thumbnails?.large),
        category: blogCategories[0],
        categories: blogCategories,
        created,
        likeCount,
        reviewCount,
        isActive,
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
