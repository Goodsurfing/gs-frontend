import { AdminArticleFormFields } from "@/features/Admin";
import { GetAdminBlog, UpdateAdminBlog } from "../model/types/adminBlogSchema";

export const blogAdapter = (data: GetAdminBlog): AdminArticleFormFields => {
    const {
        name, image, description, isActive,
        categories, author,
    } = data;

    return {
        name,
        image,
        description,
        categoryIds: categories.map((category) => category.id),
        isActive,
        author,
    };
};

export const blogApiAdapter = (data: AdminArticleFormFields): UpdateAdminBlog => {
    const {
        name, image, description, isActive,
        categoryIds, author,
    } = data;

    return {
        name,
        description,
        isActive,
        imageId: image.id,
        blogCategoryIds: categoryIds ?? [],
        authorId: author?.id ?? "",
    };
};
