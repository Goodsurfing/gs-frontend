import React, { FC, useEffect } from "react";
import cn from "classnames";
import {
    FormProvider, useForm, DefaultValues,
    Controller,
    SubmitHandler,
} from "react-hook-form";
import { Rating } from "@mui/material";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import Button from "@/shared/ui/Button/Button";
import Textarea from "@/shared/ui/Textarea/Textarea";
import { Image } from "@/types/media";
import { getMediaContent, getMediaContentsArray } from "@/shared/lib/getMediaContent";
import { ModalGallery } from "@/shared/ui/ModalGallery/ModalGallery";
import SwitchComponent from "@/shared/ui/Switch/Switch";
import styles from "./AdminReviewForm.module.scss";

export interface AdminReviewFields {
    rating: number | null;
    description: string;
    isFeatured?: boolean;
    images?: Image[];
}

interface AdminReviewFormProps {
    className?: string;
    review?: AdminReviewFields;
    onSubmit?: (data: AdminReviewFields) => void;
    isLoading: boolean;
    // isFeatured годится только для отзывов на вакансию (первое лицо,
    // волонтёр о своей поездке) — отзыв хоста о волонтёре написан от
    // третьего лица и на витрину не подходит.
    showFeaturedToggle?: boolean;
}

const defaultValues: DefaultValues<AdminReviewFields> = {
    rating: null,
    description: "",
    isFeatured: false,
    images: [],
};

export const AdminReviewForm: FC<AdminReviewFormProps> = (props) => {
    const {
        className, review, onSubmit, isLoading, showFeaturedToggle = false,
    } = props;

    const form = useForm<AdminReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit, reset, control, formState: { errors },
    } = form;
    const [isGalleryOpen, setGalleryOpen] = React.useState(false);
    const [gallerySlide, setGallerySlide] = React.useState(0);

    const onSubmitForm: SubmitHandler<AdminReviewFields> = (data) => {
        onSubmit?.(data);
    };

    useEffect(() => {
        if (review) {
            reset(review);
        } else {
            reset();
        }
    }, [review, reset]);

    return (
        <FormProvider {...form} control={control}>
            <form
                className={cn(styles.formWrapper, className)}
                onSubmit={handleSubmit(onSubmitForm)}
            >
                <div className={styles.form}>
                    <div className={styles.field}>
                        <Controller
                            rules={
                                { required: "Это поле является обязательным" }
                            }
                            control={control}
                            name="rating"
                            render={({ field }) => (
                                <>
                                    <label className={styles.label} htmlFor="rating">
                                        Рейтинг
                                    </label>
                                    <Rating
                                        id="rating"
                                        size="large"
                                        value={field.value}
                                        onChange={(_, valueItem) => field.onChange(
                                            valueItem ?? null,
                                        )}
                                        sx={{
                                            "& .MuiRating-iconFilled": {
                                                color: "#FED81C",
                                            },
                                        }}
                                    />
                                </>
                            )}
                        />
                        {errors?.rating?.message && (
                            <ErrorText
                                text={errors.rating.message}
                                className={styles.error}
                            />
                        )}
                    </div>
                    <div className={styles.field}>
                        <Controller
                            rules={
                                {
                                    required: "Это поле является обязательным",
                                    validate: (value) => {
                                        if (value === "") {
                                            return "Это поле является обязательным";
                                        }
                                        return true;
                                    },
                                }
                            }
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    value={field.value}
                                    onChange={(event) => field.onChange(event.target.value)}
                                    label="Текст отзыва"
                                    maxLength={500}
                                />
                            )}
                        />
                        {errors?.description?.message && (
                            <ErrorText
                                text={errors.description.message}
                                className={styles.error}
                            />
                        )}
                    </div>
                    <div className={styles.field}>
                        <Controller
                            control={control}
                            name="images"
                            render={({ field }) => {
                                const images = field.value ?? [];
                                if (images.length === 0) {
                                    return (
                                        <>
                                            <span className={styles.label}>Фото</span>
                                            <p>К отзыву не прикреплено фото</p>
                                        </>
                                    );
                                }
                                return (
                                    <>
                                        <span className={styles.label}>Фото</span>
                                        <div className={styles.photoGrid}>
                                            {images.map((image, index) => (
                                                <div className={styles.photoWrapper} key={image.id}>
                                                    <img
                                                        src={getMediaContent(image, "SMALL")}
                                                        alt="review"
                                                        onClick={() => {
                                                            setGallerySlide(index);
                                                            setGalleryOpen(true);
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className={styles.photoRemove}
                                                        onClick={() => {
                                                            const remaining = images.filter(
                                                                (img) => img.id !== image.id,
                                                            );
                                                            field.onChange(remaining);
                                                        }}
                                                        aria-label="Удалить фото"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <ModalGallery
                                            isOpen={isGalleryOpen}
                                            onClose={() => setGalleryOpen(false)}
                                            images={getMediaContentsArray(images)}
                                            initialSlide={gallerySlide}
                                        />
                                    </>
                                );
                            }}
                        />
                    </div>
                    {showFeaturedToggle && (
                        <div className={styles.field}>
                            <Controller
                                control={control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <label className={styles.switchLabel} htmlFor="isFeatured">
                                        <SwitchComponent
                                            id="isFeatured"
                                            checked={!!field.value}
                                            onChange={(_, checked) => field.onChange(checked)}
                                        />
                                        Показывать на главной странице
                                    </label>
                                )}
                            />
                        </div>
                    )}
                </div>
                <Button
                    type="submit"
                    color="BLUE"
                    size="MEDIUM"
                    variant="FILL"
                    disabled={isLoading}
                >
                    {isLoading ? "Идёт сохранение" : "Сохранить"}
                </Button>
            </form>
        </FormProvider>
    );
};
