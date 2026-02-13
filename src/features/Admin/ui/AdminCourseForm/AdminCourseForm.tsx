import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import cn from "classnames";
import {
    FormProvider, useForm, DefaultValues,
    Controller,
    SubmitHandler,
    useFieldArray,
} from "react-hook-form";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { ImageDropzone } from "@/shared/ui/ImageDropzone/ImageDropzone";
import Button from "@/shared/ui/Button/Button";
import {
    adminCourseAdapter,
    AdminCourseFields, AdminExpertFields,
    AdminLessonFields, GetAdminCourse,
} from "@/entities/Admin";
import { TextAreaControl } from "@/shared/ui/TextAreaControl/TextAreaControl";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { AdminLessonFormModal } from "../AdminLessonFormModal/AdminLessonFormModal";
import { AdminUsersSearchForm } from "../AdminUsersSearchForm/ui/AdminUsersSearchForm/AdminUsersSearchForm";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import { getFullAddress, getFullName } from "@/shared/lib/getFullName";
import { AdminExpertSelectorModal } from "../AdminExpertSelectorModal/AdminExpertSelectorModal";
import {
    useLazyGetAdminCourseLessonsQuery,
    useCreateAdminCourseLessonMutation,
    useUpdateAdminCourseLessonMutation,
    useDeleteAdminCourseLessonMutation,
    useLazyGetAdminCourseLessonQuery,
} from "@/entities/Admin/api/adminCourseApi";
import styles from "./AdminCourseForm.module.scss";
import { OfferPagination } from "@/widgets/OffersMap";

interface AdminCourseFormProps {
    className?: string;
    course?: GetAdminCourse;
    onSubmit?: (data: AdminCourseFields) => void;
    isLoading: boolean;
}

const defaultValues: DefaultValues<AdminCourseFields> = {
    image: null,
    name: "",
    aboutAuthor: "",
    aboutCourse: "",
    forWhom: "",
    isPublic: false,
    experts: [],
    lessons: [],
    author: null,
};

export const AdminCourseForm: FC<AdminCourseFormProps> = (props) => {
    const {
        className, course, onSubmit, isLoading,
    } = props;

    const form = useForm<AdminCourseFields>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit, reset, control, formState: { errors },
        watch,
    } = form;

    const isPublicValue = watch("isPublic");

    const textPublic = isPublicValue ? "Распубликовать" : "Опубликовать";

    const [isExpertSelectorOpen, setIsExpertSelectorOpen] = useState(false);

    const {
        fields: expertFields,
        remove: removeExpert,
        replace: replaceExperts,
    } = useFieldArray({
        control,
        name: "experts",
        keyName: "fieldId",
    });

    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [editingLessonData, setEditingLessonData] = useState<AdminLessonFields | null>(null);
    const [currentLessonPage, setCurrentLessonPage] = useState(1);
    const lessonsLimit = 5;

    const [getCourseLessons, { data: lessonsResponse }] = useLazyGetAdminCourseLessonsQuery();
    const lessonsData = lessonsResponse?.data || [];
    const totalLessonPages = Math.ceil((lessonsResponse?.pagination?.total ?? 0) / lessonsLimit);
    const [getCourseLesson] = useLazyGetAdminCourseLessonQuery();
    const [createLesson, { isLoading: isCreatingLesson }] = useCreateAdminCourseLessonMutation();
    const [updateLessonMutation,
        { isLoading: isUpdatingLesson }] = useUpdateAdminCourseLessonMutation();
    const [deleteLesson] = useDeleteAdminCourseLessonMutation();

    const fetchCourseLessons = useCallback(async () => {
        if (!course) return;

        try {
            await getCourseLessons({
                courseId: course.id,
                page: currentLessonPage,
                limit: lessonsLimit,
            }).unwrap();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error fetching lessons:", error);
        }
    }, [course, getCourseLessons, currentLessonPage, lessonsLimit]);

    useEffect(() => {
        if (course) {
            reset(adminCourseAdapter(course, []));
        } else {
            reset(defaultValues);
        }
    }, [course, reset]);

    useEffect(() => {
        fetchCourseLessons();
    }, [fetchCourseLessons]);

    const onSubmitForm: SubmitHandler<AdminCourseFields> = (data) => {
        onSubmit?.(data);
    };

    const handleExpertsChange = (selectedExperts: AdminExpertFields[]) => {
        replaceExperts(selectedExperts);
    };

    const handleOpenExpertSelector = () => {
        setIsExpertSelectorOpen(true);
    };

    const handleCloseExpertSelector = () => {
        setIsExpertSelectorOpen(false);
    };

    const handleDeleteExpert = (index: number) => {
        // eslint-disable-next-line no-alert
        if (window.confirm("Вы уверены, что хотите удалить этого эксперта из курса?")) {
            removeExpert(index);
        }
    };

    // Уроки
    const handleAddLesson = () => {
        setEditingLessonId(null);
        setEditingLessonData(null);
        setIsLessonModalOpen(true);
    };

    const handleEditLesson = async (lessonId: string) => {
        setEditingLessonId(lessonId);
        try {
            const result = await getCourseLesson(lessonId).unwrap();
            if (result) {
                const l = result;
                setEditingLessonData({
                    id: l.id,
                    name: l.name,
                    description: l.description,
                    duration: l.duration || 0,
                    image: l.image || null,
                    videoUrl: l.url || "",
                    sort: l.sort ?? 0,
                });
            } else {
                setEditingLessonData(null);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error loading lesson:", error);
            setEditingLessonData(null);
        } finally {
            await fetchCourseLessons();
        }

        setIsLessonModalOpen(true);
    };

    const handleLessonSubmit = async (data: AdminLessonFields) => {
        if (!course) return;

        try {
            if (editingLessonId !== null) {
                await updateLessonMutation({
                    id: editingLessonId,
                    body: {
                        name: data.name,
                        description: data.description,
                        duration: Number(data.duration),
                        url: data.videoUrl,
                        courseId: course.id,
                        imageId: data.image?.id || null,
                        sort: Number(data.sort),
                    },
                }).unwrap();
            } else {
                await createLesson({
                    name: data.name,
                    description: data.description,
                    duration: Number(data.duration),
                    url: data.videoUrl,
                    courseId: course.id,
                    imageId: data.image?.id || "",
                    sort: Number(data.sort),
                }).unwrap();
            }

            setIsLessonModalOpen(false);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error saving lesson:", error);
        } finally {
            setCurrentLessonPage(1);
            await fetchCourseLessons();
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        // eslint-disable-next-line no-alert
        if (window.confirm("Вы уверены, что хотите удалить этот урок?")) {
            try {
                if (lessonId) {
                    await deleteLesson(lessonId).unwrap();
                    setCurrentLessonPage(1);
                    await fetchCourseLessons();
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error deleting lesson:", error);
            }
        }
    };

    const handleCloseLessonModal = () => {
        setIsLessonModalOpen(false);
        setEditingLessonId(null);
        setEditingLessonData(null);
        setCurrentLessonPage(1);
    };

    const handlePageChangeLessons = (page: number) => {
        setCurrentLessonPage(page);
    };

    const handleTogglePublish = () => {
        reset((prev) => ({
            ...prev,
            isPublic: !prev.isPublic,
        }));
    };

    const renderLessonsSection = () => {
        if (!course) return null;

        return (
            <div className={styles.lessonsSection}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Уроки курса</h3>
                    <Button
                        type="button"
                        color="GREEN"
                        size="SMALL"
                        variant="OUTLINE"
                        onClick={handleAddLesson}
                    >
                        + Добавить урок
                    </Button>
                </div>

                {Array.isArray(lessonsData) && lessonsData.length > 0 ? (
                    <div className={styles.lessonsList}>
                        {lessonsData.map((lesson) => {
                            const description = lesson.description || "Описание отсутствует";
                            const formattedDescription = description.length > 150
                                ? `${description.slice(0, 150)}...`
                                : description;
                            const durationText = lesson.duration
                                ? `${lesson.duration}`
                                : "Продолжительность не указана";

                            return (
                                <div key={lesson.id} className={styles.lessonCard}>
                                    <div className={styles.lessonContent}>
                                        {/* <div className={styles.lessonImageWrapper}>
                                            {lesson.image ? (
                                                <img
                                                    src={getMediaContent(
                                                        lesson.image.contentUrl,
                                                    )}
                                                    alt={lesson.name}
                                                    className={styles.lessonImage}
                                                />
                                            ) : (
                                                <div
                                                    className={
                                                        styles.lessonImagePlaceholder
                                                    }
                                                >
                                                    <span className={
                                                        styles.placeholderIcon
                                                    }
                                                    >
                                                        ▶
                                                    </span>
                                                </div>
                                            )}
                                        </div> */}
                                        <div className={styles.lessonInfo}>
                                            <div className={styles.lessonHeader}>
                                                <h4 className={styles.lessonName}>
                                                    {lesson.name}
                                                </h4>
                                                <span className={styles.lessonDuration}>
                                                    {durationText}
                                                </span>
                                            </div>
                                            <p className={styles.lessonDescription}>
                                                {formattedDescription}
                                            </p>
                                            {/* {lesson.videoUrl && (
                                                <a
                                                    href={lesson.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.lessonVideoLink}
                                                >
                                                    {lesson.videoUrl}
                                                </a>
                                            )} */}
                                        </div>
                                    </div>
                                    <div className={styles.lessonActions}>
                                        <Button
                                            type="button"
                                            color="BLUE"
                                            size="SMALL"
                                            variant="TEXT"
                                            onClick={() => handleEditLesson(lesson.id)}
                                        >
                                            Редактировать
                                        </Button>
                                        <Button
                                            type="button"
                                            color="RED"
                                            size="SMALL"
                                            variant="TEXT"
                                            onClick={() => handleDeleteLesson(lesson.id)}
                                        >
                                            Удалить
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.noLessons}>
                        <p className={styles.noLessonsText}>
                            Еще нет добавленных уроков
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <FormProvider {...form} control={control}>
            <form
                className={cn(styles.formWrapper, className)}
                onSubmit={handleSubmit(onSubmitForm)}
            >
                <div className={styles.form}>
                    <InputControl
                        label="Название курса"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="name"
                        minLength={3}
                        maxLength={60}
                        isError={!!errors.name?.message}
                    />
                    {errors?.name?.message && (
                        <ErrorText
                            text={errors.name.message}
                            className={styles.error}
                        />
                    )}
                    <Controller
                        name="author"
                        control={control}
                        render={({ field }) => (
                            <AdminUsersSearchForm value={field.value} onChange={field.onChange} />
                        )}
                    />
                    <TextAreaControl
                        control={control}
                        name="aboutCourse"
                        label="Описание курса"
                        maxLength={2000}
                        description="Не более 2000 знаков"
                    />
                    {errors?.aboutCourse?.message && (
                        <ErrorText
                            text={errors.aboutCourse.message}
                            className={styles.error}
                        />
                    )}
                    <TextAreaControl
                        control={control}
                        name="aboutAuthor"
                        label="Об авторе"
                        maxLength={2000}
                        description="Не более 2000 знаков"
                    />
                    {errors?.aboutAuthor?.message && (
                        <ErrorText
                            text={errors.aboutAuthor.message}
                            className={styles.error}
                        />
                    )}
                    <TextAreaControl
                        control={control}
                        name="forWhom"
                        label="Для кого подходит курс"
                        maxLength={2000}
                        description="Не более 2000 знаков"
                    />
                    {errors?.forWhom?.message && (
                        <ErrorText
                            text={errors.forWhom.message}
                            className={styles.error}
                        />
                    )}
                    <div className={styles.field}>
                        <div className={styles.label}>Обложка курса</div>
                        <Controller
                            name="image"
                            rules={{
                                required: "Изображение обязательно",
                            }}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ImageDropzone
                                    value={value?.contentUrl}
                                    onChange={async (file) => {
                                        if (file) {
                                            await uploadFile(file.name, file)
                                                .then((result) => {
                                                    if (result) {
                                                        onChange({
                                                            id: result.id,
                                                            contentUrl: result.contentUrl,
                                                            thumbnails: result.thumbnails,
                                                        });
                                                    }
                                                })
                                                .catch(() => {
                                                    onChange(null);
                                                });
                                        }
                                    }}
                                    error={!!errors.image}
                                    accept={{
                                        "image/jpeg": [".jpeg", ".jpg"],
                                        "image/png": [".png"],
                                    }}
                                />
                            )}
                        />
                        {errors.image?.message && (
                            <ErrorText text={errors.image.message} className={styles.error} />
                        )}
                    </div>
                    <div className={styles.expertsSection}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>Эксперты курса</h3>
                            <Button
                                type="button"
                                color="GREEN"
                                size="SMALL"
                                variant="OUTLINE"
                                onClick={handleOpenExpertSelector}
                            >
                                + Выбрать экспертов
                            </Button>
                        </div>

                        {expertFields.length > 0 ? (
                            <div className={styles.expertsGrid}>
                                {expertFields.map((expert, index) => {
                                    const description = expert.project || "Описание отсутствует";
                                    const formattedDescription = description.length > 100
                                        ? `${description.slice(0, 100)}...`
                                        : description;
                                    return (
                                        <div key={expert.id} className={styles.expertCard}>
                                            <div className={styles.expertImageWrapper}>
                                                {expert.image ? (
                                                    <img
                                                        src={
                                                            getMediaContent(
                                                                (expert.image as any)?.contentUrl,
                                                            )
                                                        }
                                                        alt={`${expert.firstName} ${expert.lastName}`}
                                                        className={styles.expertImage}
                                                    />
                                                ) : (
                                                    <div className={styles.expertImagePlaceholder}>
                                                        Нет изображения
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.expertInfo}>
                                                <h4 className={styles.expertName}>
                                                    {getFullName(
                                                        expert.firstName,
                                                        expert.lastName,
                                                    )}
                                                </h4>
                                                <p className={styles.expertDescription}>
                                                    {formattedDescription}
                                                </p>
                                                <div className={styles.expertLocation}>
                                                    {getFullAddress(expert.city, expert.country)}
                                                </div>
                                            </div>
                                            <div className={styles.expertActions}>
                                                <Button
                                                    type="button"
                                                    color="RED"
                                                    size="SMALL"
                                                    variant="TEXT"
                                                    onClick={() => handleDeleteExpert(index)}
                                                >
                                                    Удалить из курса
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className={styles.noExperts}>
                                <p className={styles.noExpertsText}>
                                    Еще нет добавленных экспертов
                                </p>
                                <Button
                                    type="button"
                                    color="GREEN"
                                    size="SMALL"
                                    variant="FILL"
                                    onClick={handleOpenExpertSelector}
                                    className={styles.noExpertsButton}
                                >
                                    Выбрать экспертов
                                </Button>
                            </div>
                        )}
                    </div>

                    {renderLessonsSection()}
                    {!isLoading && totalLessonPages > 1 && (
                        <OfferPagination
                            currentPage={currentLessonPage}
                            onPageChange={handlePageChangeLessons}
                            totalPages={totalLessonPages}
                        />
                    )}
                </div>
                <div className={styles.formActions}>
                    <Button
                        type="submit"
                        color="BLUE"
                        size="MEDIUM"
                        variant="FILL"
                        disabled={isLoading}
                    >
                        {isLoading ? "Идёт сохранение" : "Сохранить"}
                    </Button>
                    <Button
                        onClick={handleTogglePublish}
                        type="button"
                        color={isPublicValue ? "RED" : "GREEN"}
                        size="MEDIUM"
                        variant="FILL"
                        disabled={isLoading}
                    >
                        {isLoading ? "Идёт публикация" : textPublic}
                    </Button>
                </div>
            </form>

            {/* Модальное окно выбора экспертов */}
            <AdminExpertSelectorModal
                isOpen={isExpertSelectorOpen}
                onClose={handleCloseExpertSelector}
                selectedExperts={expertFields}
                onExpertsChange={handleExpertsChange}
            />

            {/* Модальное окно добавления/редактирования урока */}
            <AdminLessonFormModal
                isOpen={isLessonModalOpen}
                onClose={handleCloseLessonModal}
                onSubmit={handleLessonSubmit}
                initialData={editingLessonData}
                isLoading={isCreatingLesson || isUpdatingLesson}
            />
        </FormProvider>
    );
};
