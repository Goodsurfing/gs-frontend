import {
    AdminCourseFields, CreateAdminCourseRequest,
    CreateAdminExpert, CreateAdminLesson, GetAdminCourse,
} from "../model/types/adminCourseSchema";

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

    const expertsTemp: CreateAdminExpert[] = experts.map((expert) => ({
        name: expert.name,
        description: expert.description,
        image: expert.image instanceof File ? expert.image : null,
    }));

    const lessonsTemp: CreateAdminLesson[] = lessons.map((lesson) => ({
        name: lesson.name,
        description: lesson.description,
        image: lesson.image instanceof File ? lesson.image : null,
        duration: lesson.duration,
        videoUrl: lesson.videoUrl,
    }));

    return {
        name,
        image: imageTemp,
        aboutCourse,
        aboutAuthor,
        forWhom,
        duration,
        experts: expertsTemp,
        lessons: lessonsTemp,
        isPublic,
    };
};
