import {
    AdminCourseFields, AdminExpertFields, AdminLessonFields, AdminLessonsFields,
    CreateAdminCourseLesson,
    CreateAdminCourseRequest, GetAdminCourse,
    GetAdminCourseLesson,
    GetAdminCourseLessons,
    GetAdminExperts,
} from "../model/types/adminCourseSchema";

export const adminCourseAdapter = (
    data: GetAdminCourse,
    lessons?: GetAdminCourseLessons[],
): AdminCourseFields => {
    const {
        name, description, aboutAuthor, courseFor, isActive,
        author, experts, image,
    } = data;

    const authorTemp = {
        id: author.id,
        firstName: author.firstName,
        lastName: author.lastName,
    };

    const lessonsTemp: AdminLessonsFields[] = lessons?.map((lesson) => ({
        id: lesson.id,
        name: lesson.name,
        description: lesson.description,
        duration: lesson.duration,
    })) ?? [];

    const expertsTemp: AdminExpertFields[] = experts.map((expert) => ({
        id: expert.id,
        firstName: expert.firsName,
        lastName: expert.lastName,
        image: expert.image,
        city: expert.city,
        country: expert.country,
        project: expert.project,
        sort: expert.sort,
    }));

    return {
        name,
        image,
        aboutCourse: description,
        aboutAuthor,
        forWhom: courseFor,
        isPublic: isActive,
        author: authorTemp,
        experts: expertsTemp,
        lessons: lessonsTemp,
    };
};

export const adminCreateCourseApiAdapter = (data: AdminCourseFields): CreateAdminCourseRequest => {
    const {
        name, image, aboutAuthor, aboutCourse,
        experts, forWhom, isPublic,
        author,
    } = data;

    const sortedExperts = [...experts].sort((a, b) => a.sort - b.sort);

    return {
        name,
        imageId: image?.id ?? null,
        description: aboutCourse,
        aboutAuthor,
        courseFor: forWhom,
        authorId: author?.id ?? "",
        experts: sortedExperts.map((expert) => ({
            id: expert.id,
            sort: expert.sort,
        })),
        isActive: isPublic,
    };
};

// Experts

export const adminCourseExpertsAdapter = (data: GetAdminExperts): AdminExpertFields => {
    const {
        id, firstName, lastName,
        city, country, project, image,
    } = data;

    return {
        id,
        firstName,
        lastName,
        city,
        country,
        project,
        image,
        sort: 0,
    };
};

// Lessons

export const adminCourseLessonsAdapter = (data: GetAdminCourseLessons): AdminLessonsFields => {
    const {
        id, name, description, duration,
    } = data;

    return {
        id,
        name,
        description,
        duration,
    };
};

export const adminCourseLessonAdapter = (data: GetAdminCourseLesson): AdminLessonFields => {
    const {
        id, description, duration, image, name, sort, url, files,
    } = data;

    return {
        id,
        name,
        description,
        duration,
        image,
        videoUrl: url,
        sort,
        files,
    };
};

export const adminCourseLessonApiAdapter = (data: AdminLessonFields, courseId: string):
CreateAdminCourseLesson => {
    const {
        name, description, duration, image, videoUrl, sort, files,
    } = data;

    return {
        name,
        description,
        duration,
        imageId: image?.id ?? null,
        url: videoUrl,
        sort,
        courseId,
        fileIds: files.map((f) => f.id),
    };
};
