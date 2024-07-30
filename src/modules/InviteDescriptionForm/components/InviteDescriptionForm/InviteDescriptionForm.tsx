import { useEffect, useState } from "react";
import {
    Controller,
    DefaultValues,
    FormProvider,
    useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import {
    useGetOfferByIdQuery,
    useUpdateOfferMutation,
} from "@/entities/Offer/api/offerApi";

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
import { useConfirmNavigation } from "@/shared/hooks/useConfirmNavigation";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";

const defaultValues: DefaultValues<OfferDescriptionField> = {
    title: "",
    category: [],
    fullDescription: "",
    shortDescription: "",
    coverImage: {
        uuid: null,
        image: { file: null, src: null },
    },
};

export const InviteDescriptionForm = () => {
    const form = useForm<OfferDescriptionField>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit,
        control,
        formState: { errors, isDirty },
        reset,
    } = form;
    const { id } = useParams();
    const [updateOffer, { isLoading }] = useUpdateOfferMutation();
    const { data: getOfferData, isLoading: isLoadingGetDescription } = useGetOfferByIdQuery(id || "");
    const [isCoverImageLoading, setCoverImageLoading] = useState<boolean>(false);
    const [isGalleryLoading, setGalleryLoading] = useState<boolean>(false);
    const [isGalleryError, setGalleryError] = useState<boolean>(false);
    const [isGallerySuccess, setGallerySuccess] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastAlert>();
    const { t } = useTranslation("offer");

    const handleCoverImageLoading = (value: boolean) => {
        setCoverImageLoading(value);
    };

    const handleGalleryLoading = (value: boolean) => {
        setGalleryLoading(value);
    };

    const handleGalleryError = (value: boolean) => {
        setGalleryError(value);
    };

    const handleGallerySuccess = (value: boolean) => {
        setGallerySuccess(value);
    };

    const onSubmit = handleSubmit(async (data) => {
        setToast(undefined);
        const preparedData = inviteDescriptionApiAdapter(data);
        updateOffer({ id: Number(id), body: { description: preparedData } })
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
    });

    const {
        isModalOpen,
        handleConfirmClick,
        handleModalClose,
    } = useConfirmNavigation(onSubmit, isDirty);

    useEffect(() => {
        if (getOfferData?.description) {
            reset(inviteDescriptionAdapter(getOfferData.description));
        }
    }, [getOfferData?.description, reset]);

    useEffect(() => {
        if (isGalleryError) {
            setToast({
                text: "Произошла ошибка с обновлением галереи",
                type: HintType.Error,
            });
        }
        if (isGallerySuccess) {
            setToast({
                text: "Галерея успешно обновлена",
                type: HintType.Success,
            });
        }
    }, [isGalleryError, isGallerySuccess]);

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
                                    isLoading={isCoverImageLoading}
                                    onChangeLoading={handleCoverImageLoading}
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
                    <ExtraImagesUpload
                        offerId={id || ""}
                        label={t("description.Добавить фото")}
                        isLoading={isGalleryLoading}
                        onChangeLoading={handleGalleryLoading}
                        onChangeError={handleGalleryError}
                        onChangeSuccess={handleGallerySuccess}
                    />
                </div>
                <Button
                    className={styles.btn}
                    disabled={isLoading || isCoverImageLoading || isGalleryLoading}
                    variant="FILL"
                    color="BLUE"
                    size="MEDIUM"
                    onClick={onSubmit}
                >
                    {t("description.Сохранить")}
                </Button>
                <ConfirmActionModal
                    description="Изменения не были сохранены"
                    onConfirm={handleConfirmClick}
                    onClose={handleModalClose}
                    confirmTextButton="Сохранить"
                    isModalOpen={isModalOpen}
                />
            </form>
        </FormProvider>
    );
};
