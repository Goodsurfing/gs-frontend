import { useEffect, useState } from "react";
import {
    Controller,
    DefaultValues,
    FormProvider,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAuth } from "@/routes/model/guards/AuthProvider";

import {
    useGetDescriptionQuery,
    useUpdateDescriptionMutation,
} from "@/entities/Offer/api/offerApi";

import uploadFile, {
    GenerateLinkResponse,
} from "@/shared/hooks/files/useUploadFile";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { inviteDescriptionAdapter, inviteDescriptionApiAdapter } from "../../lib/inviteDescriptionAdapter";
import { OfferDescriptionField } from "../../model/types/inviteDescription";
import Categories from "../Categories/Categories";
import EventName from "../EventName/EventName";
import ExtraImagesUpload from "../ExtraImagesUpload/ExtraImagesUpload";
import FullDescription from "../FullDescription/FullDescription";
import ImageUpload from "../ImageUpload/ImageUpload";
import ShortDescription from "../ShortDescription/ShortDescription";
import styles from "./InviteDescriptionForm.module.scss";

const defaultValues: DefaultValues<OfferDescriptionField> = {
    title: "",
    category: [],
    fullDescription: "",
    shortDescription: "",
    coverImage: {
        file: null,
        src: null,
    },
    images: [],
};

export const InviteDescriptionForm = () => {
    const form = useForm<OfferDescriptionField>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = form;
    const { id } = useParams();
    const [updateDescription, { isLoading }] = useUpdateDescriptionMutation();
    const { data: getDescription } = useGetDescriptionQuery({ id: id || "" });
    const [toast, setToast] = useState<ToastAlert>();
    const { token } = useAuth();
    const { t } = useTranslation("offer");

    const onSubmit: SubmitHandler<OfferDescriptionField> = async (data) => {
        setToast(undefined);
        // let imageUpload: string | null = data.coverImage.src;
        let imageUpload: GenerateLinkResponse | null = null;
        let extraImages: GenerateLinkResponse[] = [];
        if (!token) return;

        // upload coverImage
        if (data.coverImage.file) {
            try {
                imageUpload = (await uploadFile(
                    data.coverImage.file.name,
                    data.coverImage.file,
                    token,
                )) || null;
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке файла",
                    type: HintType.Error,
                });
            }
            if (!imageUpload) {
                setToast({
                    text: "Не удалось загрузить файл",
                    type: HintType.Error,
                });
            }
        }

        // upload extra images
        if (data.images.length !== 0) {
            const uploadImagesPromises = data.images.map((image) => {
                if (image.file) {
                    return uploadFile(image.file.name, image.file, token).catch(
                        () => null,
                    );
                }
                return image.src;
            });

            try {
                const images = await Promise.all(uploadImagesPromises);
                const filteredImages = images.filter(
                    (result): result is GenerateLinkResponse => result
                    !== null && result !== undefined,
                );
                extraImages = filteredImages;
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке файлов",
                    type: HintType.Error,
                });
            }
        }
        if (!imageUpload) return;
        const preparedData = inviteDescriptionApiAdapter(
            data,
            imageUpload?.uuid || "",
            extraImages,
        );
        updateDescription({ body: { id, description: preparedData } })
            .unwrap()
            .then(() => {
                setToast({
                    text: "Данные успешно изменены",
                    type: HintType.Success,
                });
            })
            .catch(() => {
                setToast({
                    text: "Некорректно введены данные",
                    type: HintType.Error,
                });
            });
    };

    useEffect(() => {
        if (getDescription) {
            reset(inviteDescriptionAdapter(getDescription));
        }
    }, [getDescription, reset]);

    return (
        <FormProvider {...form}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <form>
                <div className={styles.formWrapper}>
                    <EventName />
                    <Categories />
                    <ShortDescription />
                    <FullDescription />
                    <Controller
                        control={control}
                        name="coverImage"
                        rules={{
                            validate: (value) => {
                                if (!value?.src) {
                                    return "Загрузите обложку";
                                }
                                return true;
                            },
                        }}
                        render={({ field }) => (
                            <div>
                                <ImageUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    childrenLabel={t(
                                        "description.Добавить фото обложки",
                                    )}
                                />
                                <p className={styles.error}>
                                    {errors.coverImage
                                        && t(
                                            `description.${errors.coverImage?.message?.toString()}`,
                                        )}
                                </p>
                            </div>
                        )}
                    />
                    <Controller
                        name="images"
                        control={control}
                        render={({ field }) => (
                            <ExtraImagesUpload
                                label={t("description.Добавить фото")}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>
                <Button
                    className={styles.btn}
                    disabled={isLoading}
                    variant="FILL"
                    color="BLUE"
                    size="MEDIUM"
                    onClick={handleSubmit(onSubmit)}
                >
                    {t("description.Сохранить")}
                </Button>
            </form>
        </FormProvider>
    );
};
