import { Comments } from "@/features/Article";
import { GetNewsList, GetReviewsNews } from "../model/types/newsSchema";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getFullName } from "@/shared/lib/getFullName";
import { ArticleCardType } from "@/entities/Article";

export const newsReviewsAdapter = (data: GetReviewsNews[]): Comments[] => data.map((value) => {
    const { author, created, description } = value;
    return {
        authorId: author.id,
        authorAvatar: getMediaContent(author.image.contentUrl),
        authorName: getFullName(author.firstName, author.lastName),
        comment: description,
        date: created,
    };
});

export const newsArticleCardAdapter = (data: GetNewsList): ArticleCardType => {
    const {
        id, category, created, name, image, likeCount, reviewCount,
    } = data;
    return {
        id,
        category,
        created,
        likeCount,
        name,
        reviewCount,
        image: getMediaContent(image?.thumbnails?.large),
    };
};
