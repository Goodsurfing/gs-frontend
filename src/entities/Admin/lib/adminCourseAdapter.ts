import {
    AdminCourseFields, CreateAdminCourseRequest, GetAdminCourse,
} from "../model/types/adminCourseSchema";

export const adminCourseAdapter = (data: GetAdminCourse): AdminCourseFields => {
    const {
        name, description, aboutAuthor, courseFor, isActive,
        author, experts,
    } = data;

    const authorTemp = {
        id: author.id,
        firstName: author.firstName,
        lastName: author.lastName,
    };

    return {
        name,
        image: null, // TODO: add image
        aboutCourse: description,
        aboutAuthor,
        forWhom: courseFor,
        isPublic: isActive,
        author: authorTemp,
        experts: experts.map((expert) => expert.id),
    };
};

export const adminCreateCourseApiAdapter = (data: AdminCourseFields): CreateAdminCourseRequest => {
    const {
        name, image, aboutAuthor, aboutCourse,
        experts, forWhom, isPublic,
        author,
    } = data;

    return {
        name,
        imageId: image?.id ?? null,
        description: aboutCourse,
        aboutAuthor,
        courseFor: forWhom,
        authorId: author?.id ?? "",
        expertsIds: experts,
        isActive: isPublic,
    };
};
