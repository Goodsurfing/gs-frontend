import { AdminVideoFileds, GetAdminVideo, UpdateAdminVideo } from "../model/types/adminVideoSchema";

export const videoAdminApiAdapter = (video: AdminVideoFileds): UpdateAdminVideo => {
    const {
        name, description, url, categoryId,
        author, image, isActive,
    } = video;

    return {
        name,
        description,
        url,
        categoryId,
        imageId: image?.id ?? "",
        authorId: author?.id ?? "",
        isActive,
    };
};

export const videoAdminAdapter = (video: GetAdminVideo): AdminVideoFileds => {
    const {
        name, description, url,
        author, image, isActive, category,
    } = video;

    return {
        name,
        description,
        url,
        author: {
            id: author.id,
            firstName: author.firstName,
            lastName: author.lastName,
        },
        isActive,
        categoryId: category.id,
        image,
    };
};
