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
import { ErrorType } from "@/types/api/error";

import {
    useGetOfferByIdQuery,
    useUpdateOfferMutation,
} from "@/entities/Offer/api/offerApi";

import { OFFER_DESCRIPTION_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";
import Button from "@/shared/ui/Button/Button";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import {
    inviteDescriptionAdapter,
    inviteDescriptionApiAdapter,
    inviteDescriptionStorageAdapter,
} from "../../lib/inviteDescriptionAdapter";
import { OfferDescriptionField } from "../../model/types/inviteDescription";
import Categories from "../Categories/Categories";
import EventName from "../EventName/EventName";
import FullDescription from "../FullDescription/FullDescription";
import ImageUpload from "../ImageUpload/ImageUpload";
import ShortDescription from "../ShortDescription/ShortDescription";
import styles from "./InviteDescriptionForm.module.scss";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getOffersWhatToDoPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { OfferGallery } from "@/features/Gallery";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

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
    const { locale } = useLocale();

    const [updateOffer, { isLoading }] = useUpdateOfferMutation();
    const { data: getOfferData, isLoading: isLoadingGetDescription } = useGetOfferByIdQuery(id || "");

    const [isCoverImageLoading, setCoverImageLoading] = useState<boolean>(false);

    const [toast, setToast] = useState<ToastAlert>();
    const { t } = useTranslation("offer");
    const watch = useWatch({ control });

    const handleCoverImageLoading = (value: boolean) => {
        setCoverImageLoading(value);
    };

    const saveFormData = useCallback(
        (data: OfferDescriptionField) => {
            sessionStorage.setItem(
                `${OFFER_DESCRIPTION_FORM}${id}`,
                JSON.stringify(inviteDescriptionApiAdapter(data, true)),
            );
        },
        [id],
    );

    const loadFormData = useCallback((): Partial<OfferDescriptionField> | null => {
        const savedData = sessionStorage.getItem(
            `${OFFER_DESCRIPTION_FORM}${id}`,
        );
        return savedData
            ? inviteDescriptionStorageAdapter(JSON.parse(savedData))
            : null;
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
                    text: t("Данные успешно изменены"),
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

    if (isLoadingGetDescription) {
        return <MiniLoader />;
    }

    return (
        <FormProvider {...form}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <form onSubmit={onSubmit}>
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
                                    return t("description.Загрузите обложку");
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
                                {errors.coverImage && (
                                    <ErrorText
                                        text={errors.coverImage?.message}
                                    />
                                )}
                            </div>
                        )}
                    />
                    <OfferGallery offerId={id ?? ""} />
                </div>
                <div className={styles.buttons}>
                    <Button
                        className={styles.btn}
                        disabled={
                            isLoading || isCoverImageLoading
                        }
                        variant="FILL"
                        color="BLUE"
                        size="MEDIUM"
                        onClick={onSubmit}
                    >
                        {t("description.Сохранить")}
                    </Button>
                    <ButtonLink
                        path={getOffersWhatToDoPageUrl(locale, id ?? "")}
                        size="MEDIUM"
                        type="outlined"
                    >
                        {t("Дальше")}
                    </ButtonLink>
                </div>
            </form>
        </FormProvider>
    );
};
