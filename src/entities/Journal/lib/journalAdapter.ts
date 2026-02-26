import { CreateAdminJournal, GetAdminJournal } from "@/entities/Admin";
import { AdminJournalFormFields } from "@/features/Admin";

import { JournalCardType } from "@/entities/Article";
import { GetJournals, GetReviewsJournal } from "../model/journalSchema";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Comments } from "@/features/Article";
import { getFullName } from "@/shared/lib/getFullName";

export const journalApiAdapter = (data: AdminJournalFormFields): CreateAdminJournal => {
    const {
        description, image, name, isActive,
    } = data;
    return {
        description,
        imageId: image.id,
        name,
        isActive,
    };
};

export const journalAdapter = (data: GetAdminJournal): AdminJournalFormFields => {
    const {
        description, image, name, isActive,
    } = data;
    return {
        description,
        image,
        name,
        isActive,
        url: "",
    };
};

export const journalCardAdapter = (data: GetJournals[]): JournalCardType[] => data.map((item) => {
    const {
        id, name, image, likeCount, reviewCount, created,
    } = item;
    return {
        id,
        title: name,
        image: getMediaContent(image.contentUrl) ?? "",
        description: "",
        comments: reviewCount,
        likes: likeCount,
        date: created,
    };
});

export const journalReviewsAdapter = (
    data: GetReviewsJournal[],
): Comments[] => data.map((value) => {
    const { author, created, description } = value;
    return {
        authorId: author.id,
        authorAvatar: getMediaContent(author.image?.contentUrl),
        authorName: getFullName(author.firstName, author.lastName),
        comment: description,
        date: created,
    };
});
