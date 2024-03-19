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

import { useUpdateDescriptionMutation } from "@/entities/Offer/api/offerApi";

import uploadFile from "@/shared/hooks/files/useUploadFile";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { inviteDescriptionApiAdapter } from "../../lib/inviteDescriptionAdapter";
import { OfferDescriptionField } from "../../model/types/inviteDescription";
import Categories from "../Categories/Categories";
import EventName from "../EventName/EventName";
import ExtraImagesUpload from "../ExtraImagesUpload/ExtraImagesUpload";
import FullDescription from "../FullDescription/FullDescription";
import ImageUpload from "../ImageUpload/ImageUpload";
import ShortDescription from "../ShortDescription/ShortDescription";
import styles from "./InviteDescriptionForm.module.scss";
import Preloader from "@/shared/ui/Preloader/Preloader";

const defaultValues: DefaultValues<OfferDescriptionField> = {
    title: undefined,
    category: [],
    fullDescription: undefined,
    shortDescription: undefined,
    coverImage: undefined,
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
    } = form;
    const [updateDescription, { isLoading }] = useUpdateDescriptionMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { id } = useParams();
    const { token } = useAuth();
    const { t } = useTranslation("offer");

    const onSubmit: SubmitHandler<OfferDescriptionField> = async (data) => {
        setToast(undefined);
        const fileName = data.coverImage.name;
        let imageUuid: string | undefined;
        let extraImagesUuid: (string | undefined)[] = [];
        if (!token) return;
        console.log(data.coverImage);
        // upload coverImage
        try {
            imageUuid = await uploadFile(
                fileName,
                data.coverImage,
                token,
            );
        } catch {
            setToast({
                text: "Произошла ошибка при загрузке файла",
                type: HintType.Error,
            });
        }
        if (!imageUuid) {
            setToast({
                text: "Не удалось загрузить файл",
                type: HintType.Error,
            });
            return;
        }

        // upload extra images
        if (data.images.length !== 0) {
            const uploadImagesPromises = data.images.map((file) => uploadFile(
                file.name,
                file,
                token,
            )
                .then((imageDataUuid) => imageDataUuid)
                .catch(() => {
                    setToast({
                        text: "Произошла ошибка при загрузке файлов",
                        type: HintType.Error,
                    });
                    return undefined;
                }));

            try {
                const imagesUuid = await Promise.all(uploadImagesPromises);
                extraImagesUuid = imagesUuid;
            } catch {
                extraImagesUuid = [];
                setToast({
                    text: "Произошла ошибка при загрузке файлов",
                    type: HintType.Error,
                });
            }
        }
        const preparedData = inviteDescriptionApiAdapter(
            data,
            imageUuid,
            extraImagesUuid,
        );
        console.log(preparedData);

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
                            required: {
                                value: true,
                                message: "Загрузите обложку",
                            },
                        }}
                        render={({ field }) => (
                            <div>
                                <ImageUpload
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
