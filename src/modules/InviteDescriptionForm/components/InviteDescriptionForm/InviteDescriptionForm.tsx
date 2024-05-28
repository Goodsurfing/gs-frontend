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

import {
    inviteDescriptionAdapter,
    inviteDescriptionApiAdapter,
} from "../../lib/inviteDescriptionAdapter";
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
    title: "",
    category: [],
    fullDescription: "",
    shortDescription: "",
    coverImage: {
        uuid: null,
        image: { file: null, src: null },
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
    const { data: getDescription, isLoading: isLoadingGetDescription } = useGetDescriptionQuery({ id: id || "" });
    const [isLoadingCoverImage, setIsLoadingCoverImage] = useState<boolean>(false);
    const [isLoadingImages, setIsLoadingImages] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastAlert>();
    const { token } = useAuth();
    const { t } = useTranslation("offer");

    const onSubmit: SubmitHandler<OfferDescriptionField> = async (data) => {
        setToast(undefined);
        setIsLoadingImages(true);
        setIsLoadingCoverImage(true);

        let imageUpload: GenerateLinkResponse | null = null;
        let extraImages: GenerateLinkResponse[] = [];
        if (!token) {
            setIsLoadingCoverImage(false);
            setIsLoadingImages(false);
            return;
        }

        // upload coverImage
        if (data.coverImage.image.file) {
            try {
                imageUpload = (await uploadFile(
                    data.coverImage.image.file.name,
                    data.coverImage.image.file,
                    token,
                )) || null;
                setIsLoadingCoverImage(false);
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке файла",
                    type: HintType.Error,
                });
                setIsLoadingCoverImage(false);
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
                if (image.image.file) {
                    return uploadFile(
                        image.image.file.name,
                        image.image.file,
                        token,
                    ).catch(() => null);
                }
                return image.image.src;
            });

            try {
                const images = await Promise.all(uploadImagesPromises);
                const filteredImages = images.filter(
                    (result): result is GenerateLinkResponse => result !== null
                    && result !== undefined,
                );
                extraImages = filteredImages;
                setIsLoadingImages(false);
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке файлов",
                    type: HintType.Error,
                });
                setIsLoadingImages(false);
            }
        }
        // toDo: Change this logic in future
        let imageUuid: string | null = data.coverImage.uuid;
        let newGallery: string[] = [];
        const galleryTemp: string[] = data.images.map((image) => image.uuid)
            .filter((imageId): imageId is string => typeof imageId === "string") as string[];
        if (imageUpload) {
            imageUuid = imageUpload?.uuid;
        }
        if (extraImages.length > 0) {
            const extraImagesTemp: string[] = extraImages.map((image) => image.uuid);
            newGallery = [...galleryTemp, ...extraImagesTemp];
        } else {
            newGallery = [...galleryTemp];
        }
        const filteredGallery = newGallery.filter((item) => item != null);
        //

        const preparedData = inviteDescriptionApiAdapter(
            data,
            imageUuid || "",
            filteredGallery,
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
            })
            .finally(() => {
                setIsLoadingCoverImage(false);
                setIsLoadingImages(false);
            });
    };

    useEffect(() => {
        if (getDescription) {
            reset(inviteDescriptionAdapter(getDescription));
        }
    }, [getDescription, reset]);

    if (isLoadingGetDescription) {
        return <Preloader className={styles.loading} />;
    }

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
                                if (!value?.image.src) {
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
                                    isLoading={isLoadingCoverImage}
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
                                isLoading={isLoadingImages}
                                label={t("description.Добавить фото")}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>
                <Button
                    className={styles.btn}
                    disabled={isLoading || isLoadingImages}
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
