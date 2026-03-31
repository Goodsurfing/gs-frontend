import {
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
    useGetDonationAddressQuery,
    useGetDonationWhenQuery,
    useUpdateDonationAddressMutation,
    useUpdateDonationWhenMutation,
} from "@/entities/Donation";
import { getGeoObjectByCoordinates } from "@/features/MapWithAddress";
import {
    AddressFormFormFields,
    OfferWhereForm,
    offerWhereFormApiAdapter,
} from "@/features/Offer";
import { getFundraiseStepPageUrl } from "@/shared/config/routes/AppUrls";
import { FUNDRAISE_WHERE_FORM } from "@/shared/constants/localstorage";
import { formattingDate } from "@/shared/lib/formatDate";
import { getErrorText } from "@/shared/lib/getErrorText";
import Button from "@/shared/ui/Button/Button";
import DateInput from "@/shared/ui/DateInput/DateInput";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import Switch from "@/shared/ui/Switch/Switch";

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
            amount: t("main.sidebar.Сколько", { ns: "translation" }),
            description: t("main.sidebar.Описание", { ns: "translation" }),
            "auto-messages": t("main.sidebar.Настройка автоматических сообщений", {
                ns: "translation",
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
