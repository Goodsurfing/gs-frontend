import { AdminArticleFormFields } from "@/features/Admin";
import { GetAdminBlog, UpdateAdminBlog } from "../model/types/adminBlogSchema";

export const blogAdapter = (data: GetAdminBlog): AdminArticleFormFields => {
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

export const blogApiAdapter = (data: AdminArticleFormFields): UpdateAdminBlog => {
    const {
        name, image, description, isActive,
        categoryId, author,
    } = data;

    return {
        name,
        description,
        isActive,
        imageId: image.id,
        blogCategoryId: categoryId,
        authorId: author?.id ?? "",
    };
};
