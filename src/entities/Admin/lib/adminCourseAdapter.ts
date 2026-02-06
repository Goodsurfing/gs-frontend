import { AdminCourseFields, CreateAdminCourseRequest, GetAdminCourse } from "../model/types/adminCourseSchema";

export const adminCourseAdapter = (data: GetAdminCourse): AdminCourseFields => {
    const {
        name, image, aboutAuthor, aboutCourse,
        duration, experts, forWhom, isPublic,
        lessons,
    } = data;

    let imageTemp = null;

    if (image instanceof File) {
        imageTemp = image;
    }

    return {
        name,
        image: imageTemp,
        aboutCourse,
        aboutAuthor,
        forWhom,
        duration,
        experts,
        lessons,
        isPublic,
    };
};

export const adminCreateCourseApiAdapter = (data: AdminCourseFields): CreateAdminCourseRequest => {
    const {
        name, image, aboutAuthor, aboutCourse,
        duration, experts, forWhom, isPublic,
        lessons,
    } = data;

    let imageTemp = null;

    if (image instanceof File) {
        imageTemp = image;
    }

    return {
        name,
        image: imageTemp,
        aboutCourse,
        aboutAuthor,
        forWhom,
        duration,
        experts,
        lessons,
        isPublic,
    };
};
