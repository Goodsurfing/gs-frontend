import cn from "classnames";
import React, {
    FC, memo, useEffect, useState,
} from "react";
import {
    Controller,
    useFieldArray,
    useForm,
} from "react-hook-form";

import { AboutProjectInfoFields } from "@/entities/Admin";
import { OfferGallery } from "@/features/Gallery";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import Button from "@/shared/ui/Button/Button";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { TextAreaControl } from "@/shared/ui/TextAreaControl/TextAreaControl";
import { AdminAboutProjectPrincipleModal } from "./AdminAboutProjectPrincipleModal";
import styles from "./AdminAboutProjectForm.module.scss";

interface AdminAboutProjectFormProps {
    className?: string;
    initialData?: AboutProjectInfoFields;
    onComplete: (data: AboutProjectInfoFields) => void;
    isLoading: boolean;
}

type AboutProjectPrinciple = AboutProjectInfoFields["principles"][number];

export const AdminAboutProjectForm: FC<AdminAboutProjectFormProps> = memo(
    (props: AdminAboutProjectFormProps) => {
        const {
            className, initialData, onComplete,
            isLoading,
        } = props;
        const {
            formState: { errors },
            control,
            reset,
            handleSubmit,
        } = useForm<AboutProjectInfoFields>({
            mode: "onChange",
            defaultValues: {
                mission: "",
                howAllStart: "",
                principles: [],
                galleryImages: [],
            },
        });

        const {
            fields: principles,
            append: appendPrinciple,
            update: updatePrinciple,
            remove: removePrinciple,
        } = useFieldArray({
            control,
            name: "principles",
        });

        const [isPrincipleModalOpen, setIsPrincipleModalOpen] = useState(false);
        const [editingPrincipleIndex, setEditingPrincipleIndex] = useState<number | null>(null);

        useEffect(() => {
            if (initialData) {
                reset(initialData);
            } else {
                reset();
            }
        }, [initialData, reset]);

        const onSubmit = (data: AboutProjectInfoFields) => {
            onComplete(data);
        };

        const handleOpenCreatePrincipleModal = () => {
            setEditingPrincipleIndex(null);
            setIsPrincipleModalOpen(true);
        };

        const handleOpenEditPrincipleModal = (index: number) => {
            setEditingPrincipleIndex(index);
            setIsPrincipleModalOpen(true);
        };

        const handleClosePrincipleModal = () => {
            setIsPrincipleModalOpen(false);
            setEditingPrincipleIndex(null);
        };

        const handleSavePrinciple = (principle: AboutProjectPrinciple) => {
            if (editingPrincipleIndex !== null) {
                updatePrinciple(editingPrincipleIndex, principle);
            } else {
                appendPrinciple(principle);
            }

            handleClosePrincipleModal();
        };

        const handleDeletePrinciple = (index: number) => {
            if (window.confirm("Вы уверены, что хотите удалить принцип?")) {
                removePrinciple(index);
            }
        };

        const editingPrinciple = editingPrincipleIndex !== null
            ? principles[editingPrincipleIndex]
            : null;

        return (
            <>
                <form className={cn(className, styles.wrapper)}>
                    <TextAreaControl
                        label="Миссия Гудсёрфинга"
                        rules={{ required: "Данное поле обязательно для заполнения" }}
                        control={control}
                        name="mission"
                        isError={!!errors.mission?.message}
                    />
                    {errors?.mission?.message && (
                        <ErrorText
                            text={errors.mission.message}
                            className={styles.error}
                        />
                    )}
                    <TextAreaControl
                        label="Как всё началось"
                        rules={{ required: "Данное поле обязательно для заполнения" }}
                        control={control}
                        name="howAllStart"
                        isError={!!errors.howAllStart?.message}
                    />
                    {errors?.howAllStart?.message && (
                        <ErrorText
                            text={errors.howAllStart.message}
                            className={styles.error}
                        />
                    )}

                    <div className={styles.principlesSection}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>Принципы</h3>
                            <Button
                                type="button"
                                color="GREEN"
                                size="SMALL"
                                variant="OUTLINE"
                                onClick={handleOpenCreatePrincipleModal}
                            >
                                Добавить принцип
                            </Button>
                        </div>

                        {principles.length > 0 ? (
                            <div className={styles.principlesList}>
                                {principles.map((principle, index) => (
                                    <div key={principle.id} className={styles.principleCard}>
                                        <div className={styles.principleContent}>
                                            {principle.image?.contentUrl && (
                                                <img
                                                    src={getMediaContent(principle.image.contentUrl) ?? ""}
                                                    alt={principle.name}
                                                    className={styles.principleImage}
                                                />
                                            )}
                                            <div className={styles.principleText}>
                                                <h4 className={styles.principleName}>
                                                    {principle.name}
                                                </h4>
                                                <p className={styles.principleDescription}>
                                                    {principle.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.principleActions}>
                                            <Button
                                                type="button"
                                                color="BLUE"
                                                size="SMALL"
                                                variant="TEXT"
                                                onClick={() => handleOpenEditPrincipleModal(index)}
                                            >
                                                Редактировать
                                            </Button>
                                            <Button
                                                type="button"
                                                color="RED"
                                                size="SMALL"
                                                variant="TEXT"
                                                onClick={() => handleDeletePrinciple(index)}
                                            >
                                                Удалить
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.emptyPrinciples}>Принципы пока не добавлены</p>
                        )}
                    </div>

                    <Controller
                        control={control}
                        name="galleryImages"
                        render={({ field }) => (
                            <OfferGallery
                                label="Галлерея"
                                imageGallery={field.value}
                                onChangeImageGallery={(images) => field.onChange(images)}
                            />
                        )}
                    />
                    <div className={styles.containerButtons}>
                        <Button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            color="BLUE"
                            variant="FILL"
                            size="SMALL"
                            disabled={isLoading}
                        >
                            Сохранить
                        </Button>
                    </div>
                </form>

                <AdminAboutProjectPrincipleModal
                    isOpen={isPrincipleModalOpen}
                    onClose={handleClosePrincipleModal}
                    onSubmit={handleSavePrinciple}
                    initialData={editingPrinciple}
                />
            </>
        );
    },
);
