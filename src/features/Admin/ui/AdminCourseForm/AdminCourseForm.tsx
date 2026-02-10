import React, { FC, useEffect, useState } from "react";
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
    AdminCourseFields, AdminExpertFields, AdminLessonsFields, GetAdminCourse,
} from "@/entities/Admin";
import { TextAreaControl } from "@/shared/ui/TextAreaControl/TextAreaControl";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { AdminLessonFormModal } from "../AdminLessonFormModal/AdminLessonFormModal";
import { AdminUsersSearchForm } from "../AdminUsersSearchForm/ui/AdminUsersSearchForm/AdminUsersSearchForm";
import styles from "./AdminCourseForm.module.scss";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import { getFullName } from "@/shared/lib/getFullName";
import { AdminExpertSelectorModal } from "../AdminExpertSelectorModal/AdminExpertSelectorModal";

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

    // Состояние для модального окна выбора экспертов
    const [isExpertSelectorOpen, setIsExpertSelectorOpen] = useState(false);

    const {
        fields: expertFields,
        remove: removeExpert,
        replace: replaceExperts,
    } = useFieldArray({
        control,
        name: "experts",
    });

    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(null);
    const [editingLessonData, setEditingLessonData] = useState<AdminLessonsFields | null>(null);

    useEffect(() => {
        if (course) {
            reset({
                name: course.name || "",
                aboutCourse: course.description || "",
                aboutAuthor: course.aboutAuthor || "",
                forWhom: course.courseFor || "",
                image: course.image,
                author: {
                    id: course.author.id,
                    firstName: course.author.firstName,
                    lastName: course.author.lastName,
                },
                isPublic: course.isActive,
                experts: course.experts || [],
            });
        } else {
            reset(defaultValues);
        }
    }, [course, reset]);

    const onSubmitForm: SubmitHandler<AdminCourseFields> = (data) => {
        onSubmit?.(data);
    };

    // Обработчик выбора экспертов из модального окна
    const handleExpertsChange = (selectedExperts: AdminExpertFields[]) => {
        // Заменяем весь массив экспертов на выбранные
        replaceExperts(selectedExperts);
    };

    // Открытие модального окна выбора экспертов
    const handleOpenExpertSelector = () => {
        setIsExpertSelectorOpen(true);
    };

    const handleCloseExpertSelector = () => {
        setIsExpertSelectorOpen(false);
    };

    const handleDeleteExpert = (index: number) => {
        if (window.confirm("Вы уверены, что хотите удалить этого эксперта из курса?")) {
            removeExpert(index);
        }
    };

    // Уроки
    const handleAddLesson = () => {
        setEditingLessonIndex(null);
        setEditingLessonData(null);
        setIsLessonModalOpen(true);
    };

    const handleEditLesson = (index: number) => {
        // const lesson = lessonFields[index];
        // setEditingLessonIndex(index);
        // setEditingLessonData({
        //     name: lesson.name,
        //     description: lesson.description,
        //     duration: lesson.duration,
        //     image: lesson.image,
        //     videoUrl: lesson.videoUrl,
        // });
        setIsLessonModalOpen(true);
    };

    const handleLessonSubmit = (data: AdminLessonsFields) => {
        if (editingLessonIndex !== null) {
            // updateLesson(editingLessonIndex, data);
        } else {
            // appendLesson(data);
        }
        setIsLessonModalOpen(false);
    };

    const handleDeleteLesson = (index: number) => {
        if (window.confirm("Вы уверены, что хотите удалить этот урок?")) {
            // removeLesson(index);
        }
    };

    const handleCloseLessonModal = () => {
        setIsLessonModalOpen(false);
        setEditingLessonIndex(null);
        setEditingLessonData(null);
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
                        <label className={styles.label}>Обложка курса</label>
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
                                                            getMediaContent(expert.image)
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
                                                    {expert.city}
                                                    ,
                                                    {expert.country}
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

                        {/* {lessonFields.length > 0 ? (
                            <div className={styles.lessonsList}>
                                {lessonFields.map((lesson, index) => {
                                    const description = lesson.description || "Описание отсутствует";
                                    const formattedDescription = description.length > 150
                                        ? `${description.slice(0, 150)}...`
                                        : description;
                                    const durationText = lesson.duration
                                        ? `${lesson.duration} мин`
                                        : "Продолжительность не указана";

                                    return (
                                        <div key={lesson.id} className={styles.lessonCard}>
                                            <div className={styles.lessonContent}>
                                                <div className={styles.lessonImageWrapper}>
                                                    {lesson.image ? (
                                                        <img
                                                            src={typeof lesson.image === "string" ? getMediaContent(lesson.image) : URL.createObjectURL(lesson.image)}
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
                                                </div>
                                                <div className={styles.lessonInfo}>
                                                    <div className={styles.lessonHeader}>
                                                        <h4 className={styles.lessonName}>
                                                            {index + 1}
                                                            .
                                                            {lesson.name}
                                                        </h4>
                                                        <span className={styles.lessonDuration}>
                                                            {durationText}
                                                        </span>
                                                    </div>
                                                    <p className={styles.lessonDescription}>
                                                        {formattedDescription}
                                                    </p>
                                                    {lesson.videoUrl && (
                                                        <a
                                                            href={lesson.videoUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={styles.lessonVideoLink}
                                                        >
                                                            {lesson.videoUrl}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={styles.lessonActions}>
                                                <Button
                                                    type="button"
                                                    color="BLUE"
                                                    size="SMALL"
                                                    variant="TEXT"
                                                    onClick={() => handleEditLesson(index)}
                                                >
                                                    Редактировать
                                                </Button>
                                                <Button
                                                    type="button"
                                                    color="RED"
                                                    size="SMALL"
                                                    variant="TEXT"
                                                    onClick={() => handleDeleteLesson(index)}
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
                        )} */}
                    </div>
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
                isLoading={false}
            />
        </FormProvider>
    );
};
