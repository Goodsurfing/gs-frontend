import { FormControlLabel, Typography } from "@mui/material";
import cn from "classnames";
import {
    memo, useCallback, useEffect,
} from "react";
import {
    Controller, DefaultValues, useForm, useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { OfferStatus } from "@/entities/Offer";

import Button from "@/shared/ui/Button/Button";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
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
import { OFFER_FINISHING_TOUCHES_FORM } from "@/shared/constants/localstorage";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./OfferFinishingTouchesForm.module.scss";

interface OfferFinishingTouchesFormProps {
    initialData?: OfferFinishingTouchesFormFields | null;
    offerStatusData: OfferStatus;
    onComplete?: (data: OfferFinishingTouchesFormFields, offerStatus: OfferStatus) => void;
    isLoadingGetData: boolean;
    isLoadingUpdateData: boolean;
    className?: string;
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

        const {
            className, initialData, isLoadingGetData,
            isLoadingUpdateData, onComplete, offerStatusData,
        } = props;
        const { id } = useParams();
        const { t } = useTranslation("offer");
        const watch = useWatch({ control });

        const hasSavedDataInSession = useCallback(() => sessionStorage.getItem(`${OFFER_FINISHING_TOUCHES_FORM}${id}`) !== null, [id]);

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
                saveFormData(currentData as OfferFinishingTouchesFormFields);
            }
        }, [isDirty, saveFormData, watch]);

        const updateFinishingTouchesHandle = async (
            data: OfferFinishingTouchesFormFields,
            offerStatus: OfferStatus,
        ) => {
            onComplete?.(data, offerStatus);
        };

        const onSubmit = handleSubmit((data) => {
            updateFinishingTouchesHandle(data, "active");
        });

        const onDraftHandle = handleSubmit((data) => {
            updateFinishingTouchesHandle(data, "draft");
        });

        if (isLoadingGetData) {
            return (
                <div className={cn(styles.wrapper, className)}>
                    <MiniLoader />
                </div>
            );
        }

        return (
            <form onSubmit={onSubmit} className={cn(styles.wrapper, className)}>
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
                <div className={styles.buttonsWrapper}>
                    {hasSavedDataInSession() && (
                        <ErrorText text={t("У вас есть несохраненные изменения")} />
                    )}
                    <div className={styles.buttons}>
                        <Button
                            onClick={onSubmit}
                            disabled={isLoadingUpdateData}
                            color="BLUE"
                            size="MEDIUM"
                            variant="FILL"
                        >
                            {offerStatusData === "draft" ? t("finishingTouches.Опубликовать") : t("finishingTouches.Сохранить изменения")}
                        </Button>
                        <Button
                            onClick={onDraftHandle}
                            disabled={isLoadingUpdateData || (offerStatusData !== "draft")}
                            color="BLUE"
                            size="MEDIUM"
                            variant="OUTLINE"
                        >
                            {t("finishingTouches.Сохранить в черновики")}
                        </Button>
                    </div>
                </div>
            </form>
        );
    },
);
