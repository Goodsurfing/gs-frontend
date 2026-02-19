import { CreateAdminNews, GetAdminNews } from "../model/types/adminNewsSchema";
import { AdminArticleFormFields } from "@/features/Admin";

export const newsAdapter = (data: GetAdminNews): AdminArticleFormFields => {
    const {
        name, image, description, isActive,
        category, author,
    } = data;

    return {
        name,
        image,
        description,
        categoryId: category.id,
        isActive,
        author,
    };
};

export const newsApiAdapter = (data: AdminArticleFormFields): CreateAdminNews => {
    const {
        name, image, description, isActive,
        categoryId, author,
    } = data;

    return {
        name,
        image,
        description,
        categoryId,
        isActive,
        imageId: image.id,
        authorId: author.id,
    };
};
