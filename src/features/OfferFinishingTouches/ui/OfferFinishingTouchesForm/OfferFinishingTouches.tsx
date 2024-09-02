import { FormControlLabel, Typography } from "@mui/material";
import cn from "classnames";
import {
    memo, useCallback, useEffect, useState,
} from "react";
import {
    Controller, DefaultValues, useForm, useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ErrorType } from "@/types/api/error";

import { OfferStatus } from "@/entities/Offer";
import {
    useGetOfferByIdQuery,
    useUpdateOfferMutation,
} from "@/entities/Offer/api/offerApi";

import { getErrorText } from "@/shared/lib/getErrorText";
import Button from "@/shared/ui/Button/Button";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import Preloader from "@/shared/ui/Preloader/Preloader";
import SwitchComponent from "@/shared/ui/Switch/Switch";
import Textarea from "@/shared/ui/Textarea/Textarea";

import {
    offerFinishingTouchesAdapter,
    offerFinishingTouchesApiAdapter,
} from "../../lib/offerFinishingTouchesAdapter";
import { OfferFinishingTouchesFormFields } from "../../model/types/offerFinishingTouches";
import { OfferFinishingTouchesExtras } from "../OfferFinishingTouchesExtras/OfferFinishingTouchesExtras";
import { OfferQuestionnaire } from "../OfferQuestionnaire/OfferQuestionnaire";
import { OfferQuestions } from "../OfferQuestions/OfferQuestions";
import styles from "./OfferFinishingTouches.module.scss";
import { OFFER_FINISHING_TOUCHES_FORM } from "@/shared/constants/localstorage";

interface OfferFinishingTouchesFormProps {
    className?: string;
    onSuccess?: (formData: OfferFinishingTouchesFormFields) => void;
}

const defaultValues: DefaultValues<OfferFinishingTouchesFormFields> = {
    extraConditions: [],
    onlyVerified: false,
    welcomeMessage: "",
    rules: "",
    questionnaireUrl: "",
    questions: [],
};

export const OfferFinishingTouchesForm = memo(
    (props: OfferFinishingTouchesFormProps) => {
        const {
            handleSubmit,
            control,
            reset,
            formState: { isDirty, errors },
        } = useForm<OfferFinishingTouchesFormFields>({
            mode: "onChange",
            defaultValues,
        });

        const { className, onSuccess } = props;
        const { id } = useParams();
        const [updateOffer, { isLoading }] = useUpdateOfferMutation();
        const { data: getOfferData, isLoading: isOfferDataLoading } = useGetOfferByIdQuery(id || "");
        const [toast, setToast] = useState<ToastAlert>();
        const { t } = useTranslation("offer");
        const watch = useWatch({ control });

        const saveFormData = useCallback((data: OfferFinishingTouchesFormFields) => {
            sessionStorage.setItem(`${OFFER_FINISHING_TOUCHES_FORM}${id}`, JSON.stringify(offerFinishingTouchesApiAdapter(data)));
        }, [id]);

        const loadFormData = useCallback((): OfferFinishingTouchesFormFields | null => {
            const savedData = sessionStorage.getItem(`${OFFER_FINISHING_TOUCHES_FORM}${id}`);
            return savedData ? offerFinishingTouchesAdapter(JSON.parse(savedData)) : null;
        }, [id]);

        const initializeForm = useCallback(() => {
            const savedData = loadFormData();
            if (savedData) {
                reset(savedData);
            } else if (getOfferData?.finishingTouches) {
                reset(offerFinishingTouchesAdapter(getOfferData?.finishingTouches));
            } else {
                reset();
            }
        }, [getOfferData?.finishingTouches, loadFormData, reset]);

        useEffect(() => {
            initializeForm();
        }, [initializeForm]);

        useEffect(() => {
            if (isDirty) {
                const currentData = watch;
                saveFormData(currentData as OfferFinishingTouchesFormFields);
            }
        }, [isDirty, saveFormData, watch]);

        const updateFinishingTouchesHandle = (
            data: OfferFinishingTouchesFormFields,
            offerStatus: OfferStatus,
        ) => {
            const preparedData = offerFinishingTouchesApiAdapter(data);
            setToast(undefined);
            updateOffer({
                id: Number(id),
                body: {
                    finishingTouches: preparedData,
                    status: offerStatus,
                },
            })
                .unwrap()
                .then(() => {
                    setToast({
                        text: "Данные успешно изменены",
                        type: HintType.Success,
                    });
                    sessionStorage.removeItem(`${OFFER_FINISHING_TOUCHES_FORM}${id}`);
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                });
        };

        const onSubmit = handleSubmit((data) => {
            updateFinishingTouchesHandle(data, "open");
            onSuccess?.(data);
        });

        const onDraftHandle = handleSubmit((data) => {
            updateFinishingTouchesHandle(data, "empty");
        });

        // useEffect(() => {
        //     if (getOfferData?.finishingTouches) {
        //         reset(
        //             offerFinishingTouchesAdapter(getOfferData.finishingTouches),
        //         );
        //     }
        // }, [getOfferData?.finishingTouches, reset]);

        if (isOfferDataLoading) {
            return (
                <div className={cn(styles.wrapper, className)}>
                    <Preloader />
                </div>
            );
        }

        return (
            <form onSubmit={onSubmit} className={cn(styles.wrapper, className)}>
                {toast && <HintPopup text={toast.text} type={toast.type} />}
                <div className={styles.formFields}>
                    <div className={styles.skillsWrapper}>
                        <p className={styles.formTitle}>
                            {t("finishingTouches.Дополнительные условия")}
                        </p>
                        <Controller
                            name="extraConditions"
                            control={control}
                            render={({ field }) => (
                                <OfferFinishingTouchesExtras
                                    value={field.value}
                                    className={styles.skills}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.formField}>
                        <Controller
                            name="onlyVerified"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    label={(
                                        <Typography className={styles.checkbox}>
                                            {t(
                                                "finishingTouches.Принимать заявки только от проверенных участников",
                                            )}
                                        </Typography>
                                    )}
                                    control={(
                                        <SwitchComponent
                                            checked={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.formField}>
                        <p className={styles.formTitle}>
                            {t("finishingTouches.Приветственное сообщение")}
                        </p>
                        <Controller
                            name="welcomeMessage"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    label={t(
                                        "finishingTouches.Данное сообщение будет автоматически отправляться всем соискателям после того, как они нажмут кнопку «Участвовать».",
                                    )}
                                    description={t(
                                        "finishingTouches.Не более 1000 знаков",
                                    )}
                                    onChange={field.onChange}
                                    value={field.value}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.formField}>
                        <p className={styles.formTitle}>
                            {t("finishingTouches.Согласие с правилами")}
                        </p>
                        <Controller
                            name="rules"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    label={t(
                                        "finishingTouches.Добавьте информацию о правилах и условиях, существующих в вашем предложении, с которым соискатель должен быть ознакомлен в момент, когда он подаёт заявку.",
                                    )}
                                    description={t(
                                        "finishingTouches.Не более 1000 знаков",
                                    )}
                                    onChange={field.onChange}
                                    value={field.value}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.formField}>
                        <p className={styles.formTitle}>
                            {t("finishingTouches.Добавить вопросы")}
                        </p>
                        <Controller
                            name="questionnaireUrl"
                            control={control}
                            rules={{
                                pattern: {
                                    value: /^(https?:\/\/)?([\w\d.-]+\.)+[\w\d]{2,}(\/.+)?$/,
                                    message: "Введите корректную ссылку",
                                },
                            }}
                            render={({ field }) => (
                                <div>
                                    <OfferQuestionnaire
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    {errors.questionnaireUrl && (
                                        <ErrorText
                                            text={errors.questionnaireUrl.message?.toString()}
                                        />
                                    )}
                                </div>
                            )}
                        />
                    </div>
                    <Controller
                        name="questions"
                        control={control}
                        render={({ field }) => (
                            <OfferQuestions
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>
                <div className={styles.submitBtns}>
                    <Button
                        disabled={isLoading}
                        color="BLUE"
                        size="MEDIUM"
                        variant="FILL"
                        onClick={onSubmit}
                    >
                        {t("finishingTouches.Опубликовать")}
                    </Button>
                    <Button
                        onClick={onDraftHandle}
                        color="BLUE"
                        size="MEDIUM"
                        variant="OUTLINE"
                    >
                        {t("finishingTouches.Сохранить в черновики")}
                    </Button>
                </div>
            </form>
        );
    },
);
