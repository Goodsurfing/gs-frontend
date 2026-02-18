import { Comments } from "@/features/Article";
import { GetReviewsNews } from "../model/types/newsSchema";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getFullName } from "@/shared/lib/getFullName";

export const newsReviewsAdapter = (data: GetReviewsNews[]): Comments[] => data.map((value) => {
    const { author, created, description } = value;
    return {
        authorAvatar: getMediaContent(author.image.contentUrl),
        authorName: getFullName(author.firstName, author.lastName),
        comment: description,
        date: created,
    };
});
