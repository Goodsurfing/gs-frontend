import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Box, FormControlLabel, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";
import {
    DonationStatus,
    useGetDonationAddressQuery,
    useGetDonationAutoMessagesQuery,
    useGetDonationDescriptionQuery,
    useGetDonationHowManyQuery,
    useGetDonationWhenQuery,
    useUpdateDonationAddressMutation,
    useUpdateDonationAutoMessagesMutation,
    useUpdateDonationDescriptionMutation,
    useUpdateDonationHowManyMutation,
    useUpdateDonationStatusMutation,
    useUpdateDonationWhenMutation,
} from "@/entities/Donation";
import { getGeoObjectByCoordinates } from "@/features/MapWithAddress";
import {
    AddressFormFormFields,
    InviteDescriptionForm,
    OfferDescriptionField,
    OfferWhereForm,
    offerWhereFormApiAdapter,
} from "@/features/Offer";
import { getFundraiseStepPageUrl } from "@/shared/config/routes/AppUrls";
import {
    FUNDRAISE_DESCRIPTION_FORM,
    FUNDRAISE_WHERE_FORM,
} from "@/shared/constants/localstorage";
import { formattingDate } from "@/shared/lib/formatDate";
import { getErrorText } from "@/shared/lib/getErrorText";
import { AddButton } from "@/shared/ui/AddButton/AddButton";
import Button from "@/shared/ui/Button/Button";
import { CloseButton } from "@/shared/ui/CloseButton/CloseButton";
import DateInput from "@/shared/ui/DateInput/DateInput";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import Input from "@/shared/ui/Input/Input";
import Switch from "@/shared/ui/Switch/Switch";
import Textarea from "@/shared/ui/Textarea/Textarea";

import styles from "./FundraiseStepPage.module.scss";

const FundraiseStepPage = () => {
    const { t } = useTranslation(["host", "translation"]);
    const { locale } = useLocale();
    const { step, id } = useParams<{ step: string; id: string }>();

    const [toast, setToast] = useState<ToastAlert>();
    const [initialDataForm, setInitialDataForm] = useState<AddressFormFormFields | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [isUntilAmountCollected, setIsUntilAmountCollected] = useState(false);

    const [amount, setAmount] = useState("");
    const [minAmount, setMinAmount] = useState("");

    const [initialDescriptionForm,
        setInitialDescriptionForm] = useState<Partial<OfferDescriptionField> | null>(null);
    const [galleryImageIds, setGalleryImageIds] = useState<string[]>([]);

    const [wordsGratitude, setWordsGratitude] = useState("");
    const [urlProgressWork, setUrlProgressWork] = useState<string[]>([""]);
    const [autoMessageStatus, setAutoMessageStatus] = useState<DonationStatus>("draft");

    const {
        data: donationAddress,
        isLoading: isLoadingAddress,
    } = useGetDonationAddressQuery(id || "", {
        skip: !id || step !== "where",
    });

    const [updateDonationAddress, { isLoading: isSaving }] = useUpdateDonationAddressMutation();

    const {
        data: donationWhen,
        isLoading: isLoadingWhen,
    } = useGetDonationWhenQuery(id || "", {
        skip: !id || step !== "when",
    });

    const [updateDonationWhen, { isLoading: isSavingWhen }] = useUpdateDonationWhenMutation();

    const {
        data: donationHowMany,
        isLoading: isLoadingHowMany,
    } = useGetDonationHowManyQuery(id || "", {
        skip: !id || step !== "amount",
    });

    const [updateDonationHowMany, {
        isLoading: isSavingHowMany,
    }] = useUpdateDonationHowManyMutation();

    const {
        data: donationDescription,
        isLoading: isLoadingDescription,
    } = useGetDonationDescriptionQuery(id || "", {
        skip: !id || step !== "description",
    });

    const [updateDonationDescription, {
        isLoading: isSavingDescription,
    }] = useUpdateDonationDescriptionMutation();

    const {
        data: donationAutoMessages,
        isLoading: isLoadingAutoMessages,
    } = useGetDonationAutoMessagesQuery(id || "", {
        skip: !id || step !== "auto-messages",
    });

    const [updateDonationAutoMessages, {
        isLoading: isSavingAutoMessages,
    }] = useUpdateDonationAutoMessagesMutation();

    const [updateDonationStatus, {
        isLoading: isSavingDonationStatus,
    }] = useUpdateDonationStatusMutation();

    const title = useMemo(() => {
        const map: Record<string, string> = {
            where: t("hostFundraiseWhere.title", {
                defaultValue: "Где будет проходить ваш проект",
                ns: "host",
            }),
            when: t("hostFundraiseWhen.title", {
                defaultValue: "Укажите до какой даты вам нужно завершить сбор средств",
                ns: "host",
            }),
            amount: t("hostFundraiseHowMany.title", {
                defaultValue: "Укажите сумму, которая вам необходима для проведения проекта",
                ns: "host",
            }),
            description: t("hostFundraiseDescription.title", {
                defaultValue: "Описание приглашения",
                ns: "host",
            }),
            "auto-messages": t("hostFundraiseAutoMessages.title", {
                defaultValue: "Настройка автоматических сообщений",
                ns: "host",
            }),
        };

        return map[step ?? ""] || t("main.sidebar.Где", { ns: "translation" });
    }, [step, t]);

    const hasSavedDataInSession = useCallback(
        () => sessionStorage.getItem(`${FUNDRAISE_WHERE_FORM}${id}`) !== null,
        [id],
    );

    const fetchGeoObject = useCallback(async (
        whereData: { longitude: number; latitude: number },
    ) => {
        const geoObject = await getGeoObjectByCoordinates(
            whereData.longitude,
            whereData.latitude,
        );

        if (geoObject) {
            return {
                address: {
                    address: `${geoObject.description}, ${geoObject.name}`,
                    geoObject: {
                        name: geoObject.name,
                        description: geoObject.description,
                        Point: {
                            pos: `${whereData.longitude} ${whereData.latitude}`,
                        },
                    },
                },
            };
        }

        return {
            address: {
                address: "",
                geoObject: null,
            },
        };
    }, []);

    useEffect(() => {
        if (step !== "where" || !id) {
            return;
        }

        setHasUnsavedChanges(hasSavedDataInSession());

        const loadInitialData = async () => {
            const savedData = sessionStorage.getItem(`${FUNDRAISE_WHERE_FORM}${id}`);

            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    setInitialDataForm(parsed);
                    return;
                } catch {
                    sessionStorage.removeItem(`${FUNDRAISE_WHERE_FORM}${id}`);
                }
            }

            if (donationAddress?.latitude && donationAddress?.longitude) {
                const adapted = await fetchGeoObject(donationAddress);
                setInitialDataForm(adapted);
            } else {
                setInitialDataForm({
                    address: {
                        address: "",
                        geoObject: null,
                    },
                });
            }
        };

        loadInitialData();
    }, [step, id, donationAddress, fetchGeoObject, hasSavedDataInSession]);

    useEffect(() => {
        if (step !== "when") {
            return;
        }

        if (donationWhen) {
            setEndDate(donationWhen.endDate ? new Date(donationWhen.endDate) : undefined);
            setIsUntilAmountCollected(Boolean(donationWhen.isUntilAmountCollected));
        }
    }, [step, donationWhen]);

    useEffect(() => {
        if (step !== "amount") {
            return;
        }

        if (donationHowMany) {
            setAmount(donationHowMany.amount ? String(donationHowMany.amount) : "");
            setMinAmount(donationHowMany.minAmount ? String(donationHowMany.minAmount) : "");
        }
    }, [step, donationHowMany]);

    useEffect(() => {
        if (step !== "description") {
            return;
        }

        if (donationDescription) {
            setInitialDescriptionForm({
                title: donationDescription.name || "",
                shortDescription: donationDescription.shortDescription || "",
                fullDescription: donationDescription.description || "",
                coverImage: donationDescription.image,
                category: donationDescription.categoryIds || [],
            });
            setGalleryImageIds(
                donationDescription.galleryImages?.map((image) => image.id) || [],
            );
        }
    }, [step, donationDescription]);

    useEffect(() => {
        if (step !== "auto-messages") {
            return;
        }

        if (donationAutoMessages) {
            setWordsGratitude(donationAutoMessages.wordsGratitude || "");
            setUrlProgressWork(
                donationAutoMessages.urlProgressWork?.length
                    ? donationAutoMessages.urlProgressWork
                    : [""],
            );
            setAutoMessageStatus(donationAutoMessages.status || "draft");
        }
    }, [step, donationAutoMessages]);

    const onSubmitWhere = async (data: AddressFormFormFields) => {
        if (!id) {
            return;
        }

        setToast(undefined);

        const prepared = offerWhereFormApiAdapter(data);

        try {
            await updateDonationAddress({
                id,
                body: prepared,
            }).unwrap();

            sessionStorage.removeItem(`${FUNDRAISE_WHERE_FORM}${id}`);
            setHasUnsavedChanges(false);
            setToast({
                text: t("hostFundraiseWhere.saved", {
                    defaultValue: "Адрес успешно сохранён",
                    ns: "host",
                }),
                type: HintType.Success,
            });
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    const onFormChange = (isDirty: boolean) => {
        setHasUnsavedChanges(isDirty);
    };

    const handleWhenSubmit = async () => {
        if (!id) {
            return;
        }

        setToast(undefined);

        try {
            await updateDonationWhen({
                id,
                body: {
                    endDate: formattingDate(endDate) || "",
                    isUntilAmountCollected,
                },
            }).unwrap();

            setToast({
                text: t("hostFundraiseWhen.saved", {
                    defaultValue: "Настройки срока сбора сохранены",
                    ns: "host",
                }),
                type: HintType.Success,
            });
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    const handleAmountInput = (
        setter: Dispatch<SetStateAction<string>>,
    ) => (event: ChangeEvent<HTMLInputElement>) => {
        const cleanValue = event.target.value.replace(/[^\d]/g, "");
        setter(cleanValue);
    };

    const handleHowManySubmit = async () => {
        if (!id) {
            return;
        }

        setToast(undefined);

        try {
            await updateDonationHowMany({
                id,
                body: {
                    amount: Number(amount || 0),
                    minAmount: Number(minAmount || 0),
                },
            }).unwrap();

            setToast({
                text: t("hostFundraiseHowMany.saved", {
                    defaultValue: "Суммы сбора сохранены",
                    ns: "host",
                }),
                type: HintType.Success,
            });
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    const onUploadDescriptionGallery = (imageIds: string[]) => {
        setGalleryImageIds(imageIds);
    };

    const onSubmitDescription = async (data: OfferDescriptionField) => {
        if (!id || !data.coverImage?.id) {
            return;
        }

        setToast(undefined);

        try {
            await updateDonationDescription({
                id,
                body: {
                    name: data.title,
                    shortDescription: data.shortDescription,
                    description: data.fullDescription,
                    imageId: data.coverImage.id,
                    galleryImageIds,
                    categoryIds: data.category,
                },
            }).unwrap();

            sessionStorage.removeItem(`${FUNDRAISE_DESCRIPTION_FORM}${id}`);
            setToast({
                text: t("hostFundraiseDescription.saved", {
                    defaultValue: "Описание сбора сохранено",
                    ns: "host",
                }),
                type: HintType.Success,
            });
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    const handleProgressLinkChange = (index: number, value: string) => {
        setUrlProgressWork((prev) => prev.map((link, i) => (i === index ? value : link)));
    };

    const handleAddProgressLink = () => {
        setUrlProgressWork((prev) => [...prev, ""]);
    };

    const handleRemoveProgressLink = (index: number) => {
        setUrlProgressWork((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            return updated.length ? updated : [""];
        });
    };

    const handleAutoMessagesSubmit = async (status: DonationStatus) => {
        if (!id) {
            return;
        }

        setToast(undefined);

        try {
            await updateDonationAutoMessages({
                id,
                body: {
                    wordsGratitude,
                    urlProgressWork: urlProgressWork
                        .map((url) => url.trim())
                        .filter(Boolean),
                    status,
                },
            }).unwrap();

            await updateDonationStatus({
                id,
                body: { status },
            }).unwrap();

            setAutoMessageStatus(status);
            setToast({
                text: status === "active"
                    ? t("hostFundraiseAutoMessages.published", {
                        defaultValue: "Сбор опубликован",
                        ns: "host",
                    })
                    : t("hostFundraiseAutoMessages.savedDraft", {
                        defaultValue: "Сбор сохранён в черновики",
                        ns: "host",
                    }),
                type: HintType.Success,
            });
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    if (step === "where") {
        return (
            <div className={styles.wrapper}>
                {toast && <HintPopup text={toast.text} type={toast.type} />}
                <h1 className={styles.title}>{title}</h1>
                {id && (
                    <OfferWhereForm
                        initialData={initialDataForm}
                        onComplete={onSubmitWhere}
                        onFormChange={onFormChange}
                        isLoadingGetData={isLoadingAddress}
                        isLoadingUpdateData={isSaving}
                        linkNext={getFundraiseStepPageUrl(locale, "when", id)}
                        hasUnsavedChanges={hasUnsavedChanges}
                        className={styles.form}
                        offerId={id}
                        storageKeyPrefix={FUNDRAISE_WHERE_FORM}
                    />
                )}
            </div>
        );
    }

    if (step === "when") {
        return (
            <div className={styles.wrapper}>
                {toast && <HintPopup text={toast.text} type={toast.type} />}
                <h1 className={styles.title}>{title}</h1>
                <Box className={styles.whenForm}>
                    <Typography className={styles.whenLabel}>
                        {t("hostFundraiseWhen.dateLabel", {
                            defaultValue: "Дата окончания приема пожертвований",
                            ns: "host",
                        })}
                    </Typography>
                    <Box className={styles.whenControlsRow}>
                        <DateInput
                            value={endDate}
                            onDateChange={setEndDate}
                            inputDisabled={isUntilAmountCollected}
                        />
                        <FormControlLabel
                            className={styles.whenSwitch}
                            label={(
                                <Typography className={styles.whenSwitchText}>
                                    {t("hostFundraiseWhen.untilAmount", {
                                        defaultValue: "Принимаю пожертвования до тех пор, пока минимальная сумма не будет собрана",
                                        ns: "host",
                                    })}
                                </Typography>
                            )}
                            control={(
                                <Switch
                                    checked={isUntilAmountCollected}
                                    onClick={() => {
                                        setIsUntilAmountCollected((prev) => !prev);
                                    }}
                                />
                            )}
                        />
                    </Box>
                    <Button
                        variant="FILL"
                        color="BLUE"
                        size="MEDIUM"
                        className={styles.whenSave}
                        onClick={handleWhenSubmit}
                        disabled={isLoadingWhen || isSavingWhen}
                    >
                        {t("Сохранить", { ns: "offer" })}
                    </Button>
                </Box>
            </div>
        );
    }

    if (step === "amount") {
        return (
            <div className={styles.wrapper}>
                {toast && <HintPopup text={toast.text} type={toast.type} />}
                <h1 className={styles.title}>{title}</h1>
                <Box className={styles.amountForm}>
                    <Input
                        label={t("hostFundraiseHowMany.amountLabel", {
                            defaultValue: "Укажите желаемую сумму в рублях",
                            ns: "host",
                        })}
                        value={amount}
                        onChange={handleAmountInput(setAmount)}
                        inputMode="numeric"
                        disabled={isLoadingHowMany || isSavingHowMany}
                    />
                    <Input
                        className={styles.amountSecondInput}
                        label={t("hostFundraiseHowMany.minAmountLabel", {
                            defaultValue: "Укажите минимальную сумму в рублях, необходимую для проведения проекта",
                            ns: "host",
                        })}
                        value={minAmount}
                        onChange={handleAmountInput(setMinAmount)}
                        inputMode="numeric"
                        disabled={isLoadingHowMany || isSavingHowMany}
                    />
                    <Typography className={styles.amountHint}>
                        {t("hostFundraiseHowMany.hint", {
                            defaultValue: "Если на предыдущем этапе вы выбрали продолжать сбор до тех пор, пока не будет собрана минимальная сумма, сбор будет активен до тех пор, пока сумма пожертвований не достигнет этого значения.",
                            ns: "host",
                        })}
                    </Typography>
                    <Button
                        variant="FILL"
                        color="BLUE"
                        size="MEDIUM"
                        className={styles.amountSave}
                        onClick={handleHowManySubmit}
                        disabled={isLoadingHowMany || isSavingHowMany}
                    >
                        {t("Сохранить", { ns: "offer" })}
                    </Button>
                </Box>
            </div>
        );
    }

    if (step === "description") {
        return (
            <div className={styles.wrapper}>
                {toast && <HintPopup text={toast.text} type={toast.type} />}
                <h1 className={styles.title}>{title}</h1>
                <InviteDescriptionForm
                    initialData={initialDescriptionForm}
                    imageGallery={donationDescription?.galleryImages}
                    onComplete={onSubmitDescription}
                    onUploadImageGallery={onUploadDescriptionGallery}
                    isLoadingGetData={isLoadingDescription}
                    isLoadingUpdateData={isSavingDescription}
                    linkNext={getFundraiseStepPageUrl(locale, "auto-messages", id || ":id")}
                    storageKeyPrefix={FUNDRAISE_DESCRIPTION_FORM}
                />
            </div>
        );
    }

    if (step === "auto-messages") {
        return (
            <div className={styles.wrapper}>
                {toast && <HintPopup text={toast.text} type={toast.type} />}
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.autoMessagesForm}>
                    <p className={styles.autoMessagesLabel}>
                        {t("hostFundraiseAutoMessages.wordsTitle", {
                            defaultValue: "Слова благодарности",
                            ns: "host",
                        })}
                    </p>
                    <Textarea
                        label={t("hostFundraiseAutoMessages.wordsDescription", {
                            defaultValue: "Вы можете написать слова благодарности всем вашим жертвователям. Данное сообщение будет автоматически отправляться после совершения пожертвования.",
                            ns: "host",
                        })}
                        description={t("hostFundraiseAutoMessages.max", {
                            defaultValue: "Не более 1000 знаков",
                            ns: "host",
                        })}
                        value={wordsGratitude}
                        onChange={(event) => {
                            setWordsGratitude(event.target.value);
                        }}
                        maxLength={1000}
                    />

                    <p className={styles.autoMessagesLabel}>
                        {t("hostFundraiseAutoMessages.addLinkTitle", {
                            defaultValue: "Добавить ссылку",
                            ns: "host",
                        })}
                    </p>
                    <p className={styles.autoMessagesHint}>
                        {t("hostFundraiseAutoMessages.addLinkDescription", {
                            defaultValue: "Вы можете прикрепить ссылку на ваше сообщество или сайт, где можно следить за ходом проекта.",
                            ns: "host",
                        })}
                    </p>

                    <div className={styles.autoMessagesLinks}>
                        {urlProgressWork.map((link, index) => (
                            <div key={`${index}-${link}`} className={styles.autoMessagesLinkRow}>
                                <Input
                                    value={link}
                                    onChange={(event) => {
                                        handleProgressLinkChange(index, event.target.value);
                                    }}
                                    disabled={isLoadingAutoMessages || isSavingAutoMessages}
                                />
                                <CloseButton
                                    className={styles.autoMessagesRemoveLink}
                                    onClick={() => {
                                        handleRemoveProgressLink(index);
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <AddButton
                        className={styles.autoMessagesAddButton}
                        text={t("hostFundraiseAutoMessages.addLinkButton", {
                            defaultValue: "Добавить ссылку",
                            ns: "host",
                        })}
                        onClick={handleAddProgressLink}
                        disabled={isLoadingAutoMessages || isSavingAutoMessages}
                    />

                    <div className={styles.autoMessagesButtons}>
                        <Button
                            color="BLUE"
                            size="MEDIUM"
                            variant="FILL"
                            onClick={() => {
                                handleAutoMessagesSubmit("active");
                            }}
                            disabled={
                                isLoadingAutoMessages
                                || isSavingAutoMessages
                                || isSavingDonationStatus
                            }
                        >
                            {autoMessageStatus === "draft"
                                ? t("hostFundraiseAutoMessages.publish", {
                                    defaultValue: "Опубликовать",
                                    ns: "host",
                                })
                                : t("hostFundraiseAutoMessages.saveChanges", {
                                    defaultValue: "Сохранить изменения",
                                    ns: "host",
                                })}
                        </Button>
                        <Button
                            color="BLUE"
                            size="MEDIUM"
                            variant="OUTLINE"
                            onClick={() => {
                                handleAutoMessagesSubmit("draft");
                            }}
                            disabled={
                                isLoadingAutoMessages
                                || isSavingAutoMessages
                                || isSavingDonationStatus
                            }
                        >
                            {t("hostFundraiseAutoMessages.saveDraft", {
                                defaultValue: "Сохранить в черновики",
                                ns: "host",
                            })}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>
                {t("hostFundraiseWelcome.stepPlaceholder", { ns: "host" })}
            </p>
        </div>
    );
};

export default FundraiseStepPage;
