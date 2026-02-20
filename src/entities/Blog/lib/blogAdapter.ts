import { ArticleCardType } from "@/entities/Article";
import { GetBlogList } from "../model/types/blogSchema";
import { getMediaContent } from "@/shared/lib/getMediaContent";

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
