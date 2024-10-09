import { useCallback, useEffect, useState } from "react";
import {
    Controller,
    DefaultValues,
    FormProvider,
    useForm,
    useWatch,
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
import { ErrorType } from "@/types/api/error";
import { getErrorText } from "@/shared/lib/getErrorText";
import { OFFER_DESCRIPTION_FORM } from "@/shared/constants/localstorage";

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
    const watch = useWatch({ control });

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

    const saveFormData = useCallback((data: OfferDescriptionField) => {
        sessionStorage.setItem(`${OFFER_DESCRIPTION_FORM}${id}`, JSON.stringify(inviteDescriptionApiAdapter(data, true)));
    }, [id]);

    const loadFormData = useCallback((): Partial<OfferDescriptionField> | null => {
        const savedData = sessionStorage.getItem(`${OFFER_DESCRIPTION_FORM}${id}`);
        return savedData ? inviteDescriptionAdapter(JSON.parse(savedData)) : null;
    }, [id]);

    const initializeForm = useCallback(() => {
        const savedData = loadFormData();
        if (savedData) {
            reset(savedData);
        } else if (getOfferData?.description) {
            reset(inviteDescriptionAdapter(getOfferData?.description));
        } else {
            reset();
        }
    }, [getOfferData?.description, loadFormData, reset]);

    useEffect(() => {
        initializeForm();
    }, [initializeForm]);

    useEffect(() => {
        if (isDirty) {
            const currentData = watch;
            saveFormData(currentData as OfferDescriptionField);
        }
    }, [isDirty, saveFormData, watch]);

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
                sessionStorage.removeItem(`${OFFER_DESCRIPTION_FORM}${id}`);
            })
            .catch((error: ErrorType) => {
                setToast({
                    text: getErrorText(error),
                    type: HintType.Error,
                });
            });
    });

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
            </form>
        </FormProvider>
    );
};
