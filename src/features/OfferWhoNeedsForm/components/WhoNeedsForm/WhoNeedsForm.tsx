import cn from "classnames";
import {
    memo, useCallback, useEffect, useState,
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
import { ErrorType } from "@/types/api/error";

import {
    useGetOfferByIdQuery,
    useUpdateOfferMutation,
} from "@/entities/Offer/api/offerApi";
import { Age } from "@/entities/Offer/model/types/offerWhoNeeds";

import { OFFER_WHO_NEEDS_FORM } from "@/shared/constants/localstorage";
import { THIS_FIELD_IS_REQUIRED } from "@/shared/constants/messages";
import { getErrorText } from "@/shared/lib/getErrorText";
import Button from "@/shared/ui/Button/Button";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import Input from "@/shared/ui/Input/Input";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { MINIMAL_AGE_FOR_VOLUNTEER } from "../../constants";
import {
    offerWhoNeedsAdapter,
    offerWhoNeedsApiAdapter,
} from "../../lib/offerWhoNeedsAdapter";
import { OfferWhoNeedsFields } from "../../model/types/offerWhoNeeds";
import { AgeComponent } from "../Age/Age";
import { GenderComponent } from "../Gender/Gender";
import LanguagesGroup from "../LanguagesGroup/LanguagesGroup";
import Location from "../Location/Location";
import styles from "./WhoNeedsForm.module.scss";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getOffersDescriptionPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

const ageDefaultValue: Age = { minAge: MINIMAL_AGE_FOR_VOLUNTEER, maxAge: 18 };

const defaultValues: DefaultValues<OfferWhoNeedsFields> = {
    gender: [],
    age: ageDefaultValue,
    languages: [],
    receptionPlace: "any",
    volunteerPlaces: 0,
    needAllLanguages: false,
    additionalInfo: "",
};

export const WhoNeedsForm = memo(() => {
    const form = useForm<OfferWhoNeedsFields>({
        mode: "onChange",
        defaultValues,
    });
    const { id } = useParams();
    const { locale } = useLocale();

    const [updateOffer, { isLoading }] = useUpdateOfferMutation();
    const { data: getOfferData, isLoading: isLoadingGetWhoNeedsData } = useGetOfferByIdQuery(id || "");
    const { t } = useTranslation("offer");
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isDirty },
    } = form;
    const [toast, setToast] = useState<ToastAlert>();
    const watch = useWatch({ control });

    const hasSavedDataInSession = useCallback(() => sessionStorage.getItem(`${OFFER_WHO_NEEDS_FORM}${id}`) !== null, [id]);

    const saveFormData = useCallback(
        (data: OfferWhoNeedsFields) => {
            sessionStorage.setItem(
                `${OFFER_WHO_NEEDS_FORM}${id}`,
                JSON.stringify(offerWhoNeedsAdapter(data)),
            );
        },
        [id],
    );

    const loadFormData = useCallback((): OfferWhoNeedsFields | null => {
        const savedData = sessionStorage.getItem(
            `${OFFER_WHO_NEEDS_FORM}${id}`,
        );
        return savedData
            ? offerWhoNeedsApiAdapter(JSON.parse(savedData))
            : null;
    }, [id]);

    const initializeForm = useCallback(() => {
        const savedData = loadFormData();
        if (savedData) {
            reset(savedData);
        } else if (getOfferData?.howNeed) {
            reset(offerWhoNeedsApiAdapter(getOfferData?.howNeed));
        } else {
            reset();
        }
    }, [getOfferData?.howNeed, loadFormData, reset]);

    useEffect(() => {
        initializeForm();
    }, [initializeForm]);

    useEffect(() => {
        if (isDirty) {
            const currentData = watch;
            saveFormData(currentData as OfferWhoNeedsFields);
        }
    }, [isDirty, saveFormData, watch]);

    const onSubmit = handleSubmit(async (data) => {
        const preparedData = offerWhoNeedsAdapter(data);
        setToast(undefined);
        updateOffer({ id: Number(id), body: { howNeeds: preparedData } })
            .unwrap()
            .then(() => {
                setToast({
                    text: "Данные успешно изменены",
                    type: HintType.Success,
                });
                sessionStorage.removeItem(`${OFFER_WHO_NEEDS_FORM}${id}`);
            })
            .catch((error: ErrorType) => {
                setToast({
                    text: getErrorText(error),
                    type: HintType.Error,
                });
            });
    });

    if (isLoadingGetWhoNeedsData) {
        return <MiniLoader />;
    }

    return (
        <FormProvider {...form}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <form className={styles.wrapper}>
                <Controller
                    control={control}
                    name="gender"
                    rules={{ required: THIS_FIELD_IS_REQUIRED }}
                    render={({ field }) => (
                        <>
                            <GenderComponent
                                value={field.value}
                                onChange={field.onChange}
                            />
                            {errors.gender && (
                                <ErrorText
                                    text={errors.gender.message?.toString()}
                                />
                            )}
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name="age"
                    rules={{ required: THIS_FIELD_IS_REQUIRED }}
                    render={({ field }) => (
                        <>
                            <AgeComponent
                                value={field.value}
                                onChange={field.onChange}
                            />
                            {errors.age && (
                                <ErrorText
                                    text={errors.age.message?.toString()}
                                />
                            )}
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name="languages"
                    render={({ field }) => (
                        <LanguagesGroup
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    name="volunteerPlaces"
                    control={control}
                    rules={{
                        required: THIS_FIELD_IS_REQUIRED,
                        validate: (value) => value !== 0 || THIS_FIELD_IS_REQUIRED,
                    }}
                    render={({ field }) => (
                        <>
                            <Input
                                className={cn(styles.container, styles.input)}
                                type="number"
                                label={t(
                                    "whoNeeds.Сколько волонтерских мест одновременно",
                                )}
                                value={String(field.value)}
                                onChange={(e) => {
                                    const inputValue = +e.target.value;
                                    if (inputValue >= 0 && inputValue <= 999) {
                                        field.onChange(inputValue);
                                    }
                                }}
                            />
                            {errors.volunteerPlaces && (
                                <ErrorText
                                    text={errors.volunteerPlaces.message?.toString()}
                                />
                            )}
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name="receptionPlace"
                    render={({ field }) => (
                        <Location
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    name="additionalInfo"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            className={cn(styles.container, styles.textarea)}
                            value={field.value}
                            onChange={field.onChange}
                            label={t("whoNeeds.Дополнительная информация")}
                            description={t("whoNeeds.Не более 1000 знаков")}
                            maxLength={1000}
                        />
                    )}
                />
                <div className={styles.buttonsWrapper}>
                    {hasSavedDataInSession() && (
                        <ErrorText text={t("У вас есть несохраненные изменения")} />
                    )}
                    <div className={styles.buttons}>
                        <Button
                            disabled={isLoading}
                            onClick={onSubmit}
                            className={styles.btn}
                            variant="FILL"
                            color="BLUE"
                            size="MEDIUM"
                        >
                            {t("Сохранить")}
                        </Button>
                        <ButtonLink
                            path={getOffersDescriptionPageUrl(locale, id ?? "")}
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
});
