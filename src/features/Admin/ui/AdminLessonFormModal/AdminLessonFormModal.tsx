import React, { FC, useEffect } from "react";
import {
    useForm, SubmitHandler, FormProvider, Controller,
} from "react-hook-form";
import { Modal } from "@/shared/ui/Modal/Modal";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { TextAreaControl } from "@/shared/ui/TextAreaControl/TextAreaControl";
import { ImageDropzone } from "@/shared/ui/ImageDropzone/ImageDropzone";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import Button from "@/shared/ui/Button/Button";
import { AdminLessonsFields } from "@/entities/Admin";
import styles from "./AdminLessonFormModal.module.scss";

interface AdminLessonFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AdminLessonsFields) => void;
    initialData?: AdminLessonsFields | null;
    isLoading?: boolean;
}

export const AdminLessonFormModal: FC<AdminLessonFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isLoading = false,
}) => {
    const form = useForm<AdminLessonsFields>({
        mode: "onChange",
        defaultValues: {
            name: "",
            description: "",
            duration: 0,
            image: null,
            videoUrl: "",
        },
    });

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = form;

    useEffect(() => {
        if (isOpen && initialData) {
            reset(initialData);
        } else if (isOpen) {
            reset({
                name: "", description: "", duration: 0, image: null, videoUrl: "",
            });
        }
    }, [isOpen, initialData, reset]);

    const onSubmitForm: SubmitHandler<AdminLessonsFields> = (data) => {
        onSubmit(data);
    };

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose} isShowCloseIcon>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>
                    {initialData ? "Редактировать урок" : "Добавить урок"}
                </h2>

                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div className={styles.form}>
                            <InputControl
                                label="Название урока"
                                rules={{
                                    required: "Название обязательно",
                                    minLength: { value: 3, message: "Минимум 3 символа" },
                                }}
                                control={control}
                                name="name"
                                placeholder="Введите название урока"
                                isError={!!errors.name}
                            />
                            {errors.name && (
                                <ErrorText text={errors.name.message} className={styles.error} />
                            )}

                            <TextAreaControl
                                control={control}
                                name="description"
                                label="Описание урока"
                                placeholder="Краткое описание содержания урока"
                                maxLength={1000}
                                description="Не более 1000 знаков"
                                rules={{
                                    maxLength: { value: 1000, message: "Превышено ограничение в 1000 символов" },
                                }}
                            />
                            {errors.description && (
                                <ErrorText
                                    text={errors.description.message}
                                    className={styles.error}
                                />
                            )}

                            <InputControl
                                label="URL видео"
                                rules={{
                                    required: "URL видео обязателен",
                                    pattern: {
                                        value: /^(?:(?:https?:\/\/)?(?:www\.)?(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch?.+&v=))((\w|-){11})(?:\S+)?|(?:https?:\/\/)?(?:www\.)?(?:vimeo.com\/)(\d+)|(?:https?:\/\/)?(?:www\.)?(?:vk\.com\/(?:video|videos)-?\d+_\d+|vkvideo\.ru\/(?:video-?\d+_\d+|video_ext\.php\?(?:[^&]*&)?(?:oid|id)=-?\d+_\d+))|(?:https?:\/\/)?(?:www\.)?(?:rutube.ru\/video\/)([a-f0-9]{32})(?:\/\S*)?)$/,
                                        message: "Введите корректный URL видео (YouTube, VK, Rutube)",
                                    },
                                }}
                                control={control}
                                name="videoUrl"
                                placeholder="Ссылка на видео"
                                isError={!!errors.videoUrl}
                                type="url"
                            />
                            {errors.videoUrl && (
                                <ErrorText
                                    text={errors.videoUrl.message}
                                    className={styles.error}
                                />
                            )}

                            <InputControl
                                label="Продолжительность (минуты)"
                                type="number"
                                rules={{
                                    required: "Продолжительность обязательна",
                                    min: { value: 1, message: "Минимум 1 минута" },
                                }}
                                control={control}
                                name="duration"
                                placeholder="Введите длительность в минутах"
                                isError={!!errors.duration}
                            />
                            {errors.duration && (
                                <ErrorText
                                    text={errors.duration.message}
                                    className={styles.error}
                                />
                            )}

                            <div className={styles.field}>
                                <label className={styles.label}>Обложка урока</label>
                                <Controller
                                    name="image"
                                    rules={{ required: "Изображение обязательно" }}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <ImageDropzone
                                            value={value}
                                            onChange={onChange}
                                            error={!!errors.image}
                                            accept={{
                                                "image/jpeg": [".jpeg", ".jpg"],
                                                "image/png": [".png"],
                                            }}
                                        />
                                    )}
                                />
                                {errors.image?.message && (
                                    <ErrorText
                                        text={errors.image.message}
                                        className={styles.error}
                                    />
                                )}
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <Button
                                type="button"
                                color="GRAY"
                                size="MEDIUM"
                                variant="OUTLINE"
                                onClick={onClose}
                                disabled={isLoading}
                                className={styles.cancelButton}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                color="GREEN"
                                size="MEDIUM"
                                variant="FILL"
                                disabled={isLoading}
                                className={styles.submitButton}
                            >
                                {isLoading ? "Сохранение..." : "Сохранить"}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </Modal>
    );
};
