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
import styles from "./AdminLessonReviewForm.module.scss";

export interface AdminLessonReviewFields {
    rating: number | null;
    description: string;
    isActive: boolean;
}

interface AdminLessonReviewFormProps {
    className?: string;
    review?: AdminLessonReviewFields;
    onSubmit?: (data: AdminLessonReviewFields) => void;
    isLoading: boolean;
}

const defaultValues: DefaultValues<AdminLessonReviewFields> = {
    rating: null,
    description: "",
    isActive: false,
};

export const AdminLessonReviewForm: FC<AdminLessonReviewFormProps> = (props) => {
    const {
        className, review, onSubmit, isLoading,
    } = props;

    const form = useForm<AdminLessonReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit, reset, control, formState: { errors },
    } = form;

    const getColorIsActive = (isActive?: boolean) => {
        if (!isActive) return "GREEN";
        return isActive ? "RED" : "GREEN";
    };

    const getTextIsActive = (isActive?: boolean) => {
        if (!isActive) return "Опубликовать";
        return isActive ? "Распубликовать" : "Опубликовать";
    };

    const onSubmitForm: SubmitHandler<AdminLessonReviewFields> = (data) => {
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
                </div>
                <div className={styles.buttons}>
                    <Button
                        type="submit"
                        color="BLUE"
                        size="MEDIUM"
                        variant="FILL"
                        disabled={isLoading}
                    >
                        {isLoading ? "Идёт сохранение" : "Сохранить"}
                    </Button>
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <Button
                                onClick={() => field.onChange(!field.value)}
                                type="button"
                                color={getColorIsActive(field.value)}
                                size="MEDIUM"
                                variant="FILL"
                            >
                                {getTextIsActive(field.value)}
                            </Button>
                        )}
                    />
                </div>
            </form>
        </FormProvider>
    );
};
