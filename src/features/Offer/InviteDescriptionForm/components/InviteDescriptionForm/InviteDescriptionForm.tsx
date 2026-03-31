import {
    FC, useCallback, useEffect,
} from "react";
import {
    Controller,
    DefaultValues,
    FormProvider,
    useForm,
    useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { OFFER_DESCRIPTION_FORM } from "@/shared/constants/localstorage";
import Button from "@/shared/ui/Button/Button";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";

import {
    fromSessionStorageAdapter,
    inviteDescriptionApiAdapter,
} from "../../lib/inviteDescriptionAdapter";
import { OfferDescriptionField } from "../../model/types/inviteDescription";
import Categories from "../Categories/Categories";
import EventName from "../EventName/EventName";
import FullDescription from "../FullDescription/FullDescription";
import ImageUpload from "../ImageUpload/ImageUpload";
import ShortDescription from "../ShortDescription/ShortDescription";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { OfferGallery } from "@/features/Gallery";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./InviteDescriptionForm.module.scss";
import { Image } from "@/types/media";

const defaultValues: DefaultValues<OfferDescriptionField> = {
    title: "",
    category: [],
    fullDescription: "",
    shortDescription: "",
    coverImage: null,
};

interface InviteDescriptionFormProps {
    initialData?: Partial<OfferDescriptionField> | null;
    imageGallery?: Image[];
    onComplete?: (data: OfferDescriptionField) => void;
    onUploadImageGallery: (data: string[]) => void;
    isLoadingGetData: boolean;
    isLoadingUpdateData: boolean;
    linkNext: string;
    storageKeyPrefix?: string;
}

export const InviteDescriptionForm: FC<InviteDescriptionFormProps> = (props) => {
    const {
        initialData, onComplete, isLoadingGetData, isLoadingUpdateData,
        linkNext, imageGallery, onUploadImageGallery,
        storageKeyPrefix = OFFER_DESCRIPTION_FORM,
    } = props;

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

    const { t } = useTranslation("offer");
    const watch = useWatch({ control });

    const hasSavedDataInSession = useCallback(
        () => sessionStorage.getItem(`${storageKeyPrefix}${id}`) !== null,
        [id, storageKeyPrefix],
    );

    const saveFormData = useCallback(
        (data: OfferDescriptionField) => {
            sessionStorage.setItem(
                `${storageKeyPrefix}${id}`,
                JSON.stringify(inviteDescriptionApiAdapter(data)),
            );
        },
        [id, storageKeyPrefix],
    );

    const loadFormData = useCallback((): Partial<OfferDescriptionField> | null => {
        const savedData = sessionStorage.getItem(
            `${storageKeyPrefix}${id}`,
        );
        return savedData
            ? fromSessionStorageAdapter(JSON.parse(savedData), initialData?.coverImage)
            : null;
    }, [id, initialData?.coverImage, storageKeyPrefix]);

    const initializeForm = useCallback(() => {
        const savedData = loadFormData();
        if (savedData) {
            reset(savedData);
        } else if (initialData) {
            reset(initialData);
        } else {
            reset();
        }
    }, [initialData, loadFormData, reset]);

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
        onComplete?.(data);
    });

    if (isLoadingGetData) {
        return <MiniLoader />;
    }

    return (
        <FormProvider {...form}>
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
                                if (!value) {
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
                    <OfferGallery
                        imageGallery={imageGallery}
                        onUploadImageGallery={onUploadImageGallery}
                    />
                </div>
                <div className={styles.buttonsWrapper}>
                    {hasSavedDataInSession() && (
                        <ErrorText text={t("У вас есть несохраненные изменения")} />
                    )}
                    <div className={styles.buttons}>
                        <Button
                            className={styles.btn}
                            disabled={isLoadingUpdateData}
                            variant="FILL"
                            color="BLUE"
                            size="MEDIUM"
                            onClick={onSubmit}
                        >
                            {t("description.Сохранить")}
                        </Button>
                        <ButtonLink
                            path={linkNext}
                            size="MEDIUM"
                            type="outlined"
                        >
                            {t("Дальше")}
                        </ButtonLink>
                    </div>
                </div>

            </form>
        </FormProvider>
    );
};
