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
import { AdminExpertFormModal } from "../AdminExpertFormModal/AdminExpertFormModal";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { AdminLessonFormModal } from "../AdminLessonFormModal/AdminLessonFormModal";
import { AdminUsersSearchForm } from "../AdminUsersSearchForm/ui/AdminUsersSearchForm/AdminUsersSearchForm";
import styles from "./AdminCourseForm.module.scss";
import uploadFile from "@/shared/hooks/files/useUploadFile";

interface AdminCourseFormProps {
    className?: string;
    course?: GetAdminCourse;
    expertsList: AdminExpertFields[];
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
        className, course, onSubmit, isLoading, expertsList,
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

    const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
    const [editingExpertIndex, setEditingExpertIndex] = useState<number | null>(null);
    const [editingExpertData, setEditingExpertData] = useState<AdminExpertFields | null>(null);

    const {
        fields: expertFields,
        append: appendExpert,
        remove: removeExpert,
        update: updateExpert,
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
                aboutCourse: course.aboutCourse || "",
                aboutAuthor: course.aboutAuthor || "",
                forWhom: course.forWhom || "",
                image: course.image?.contentUrl || null,
                duration: course.duration || 0,
                experts: course.experts?.map((expert) => ({
                    name: expert.name || "",
                    description: expert.description || "",
                    image: expert.image?.contentUrl || null,
                })) || [],
                lessons: course.lessons?.map((lesson) => ({
                    name: lesson.name || "",
                    description: lesson.description || "",
                    duration: lesson.duration || 0,
                    image: lesson.image || null,
                    videoUrl: lesson.videoUrl || "",
                })) || [],
                isPublic: course.isPublic,
            });
        } else {
            reset(defaultValues);
        }
    }, [course, reset]);

    const onSubmitForm: SubmitHandler<AdminCourseFields> = (data) => {
        onSubmit?.(data);
    };

    const handleAddExpert = () => {
        setEditingExpertIndex(null);
        setEditingExpertData(null);
        setIsExpertModalOpen(true);
    };

    const handleEditExpert = (index: number) => {
        const expert = expertFields[index];
        setEditingExpertIndex(index);
        setEditingExpertData({
            name: expert.name,
            description: expert.description,
            image: expert.image,
        });
        setIsExpertModalOpen(true);
    };

    const handleExpertSubmit = (data: AdminExpertFields) => {
        if (editingExpertIndex !== null) {
            updateExpert(editingExpertIndex, data);
        } else {
            appendExpert(data);
        }
        setIsExpertModalOpen(false);
    };

    const handleDeleteExpert = (index: number) => {
        if (window.confirm("Вы уверены, что хотите удалить этого эксперта?")) {
            removeExpert(index);
        }
    };

    const handleCloseExpertModal = () => {
        setIsExpertModalOpen(false);
        setEditingExpertIndex(null);
        setEditingExpertData(null);
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
                                onClick={handleAddExpert}
                            >
                                + Добавить эксперта
                            </Button>
                        </div>

                        {expertFields.length > 0 ? (
                            <div className={styles.expertsGrid}>
                                {expertFields.map((expert, index) => {
                                    const description = expert.description || "Описание отсутствует";
                                    const formattedDescription = description.length > 100
                                        ? `${description.slice(0, 100)}...`
                                        : description;
                                    return (
                                        <div key={expert.id} className={styles.expertCard}>
                                            <div className={styles.expertImageWrapper}>
                                                {expert.image ? (
                                                    <img
                                                        src={
                                                            getMediaContent(expert.image.contentUrl)
                                                        }
                                                        alt={expert.name}
                                                        className={styles.expertImage}
                                                    />
                                                ) : (
                                                    <div className={styles.expertImagePlaceholder}>
                                                        Нет изображения
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.expertInfo}>
                                                <h4 className={styles.expertName}>{expert.name}</h4>
                                                <p className={styles.expertDescription}>
                                                    {formattedDescription}
                                                </p>
                                            </div>
                                            <div className={styles.expertActions}>
                                                <Button
                                                    type="button"
                                                    color="BLUE"
                                                    size="SMALL"
                                                    variant="TEXT"
                                                    onClick={() => handleEditExpert(index)}
                                                >
                                                    Редактировать
                                                </Button>
                                                <Button
                                                    type="button"
                                                    color="RED"
                                                    size="SMALL"
                                                    variant="TEXT"
                                                    onClick={() => handleDeleteExpert(index)}
                                                >
                                                    Удалить
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
            <AdminExpertFormModal
                isOpen={isExpertModalOpen}
                onClose={handleCloseExpertModal}
                onSubmit={handleExpertSubmit}
                initialData={editingExpertData}
                isLoading={false}
            />
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
