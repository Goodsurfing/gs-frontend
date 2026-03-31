import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";
import {
    useGetDonationAddressQuery,
    useUpdateDonationAddressMutation,
} from "@/entities/Donation";
import { getGeoObjectByCoordinates } from "@/features/MapWithAddress";
import {
    AddressFormFormFields,
    OfferWhereForm,
    offerWhereFormApiAdapter,
} from "@/features/Offer";
import { getFundraiseStepPageUrl } from "@/shared/config/routes/AppUrls";
import { FUNDRAISE_WHERE_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";

import styles from "./FundraiseStepPage.module.scss";

const FundraiseStepPage = () => {
    const { t } = useTranslation(["host", "translation"]);
    const { locale } = useLocale();
    const { step, id } = useParams<{ step: string; id: string }>();

    const [toast, setToast] = useState<ToastAlert>();
    const [initialDataForm, setInitialDataForm] = useState<AddressFormFormFields | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const {
        data: donationAddress,
        isLoading: isLoadingAddress,
    } = useGetDonationAddressQuery(id || "", {
        skip: !id || step !== "where",
    });

    const [updateDonationAddress, { isLoading: isSaving }] = useUpdateDonationAddressMutation();

    const title = useMemo(() => {
        const map: Record<string, string> = {
            where: t("hostFundraiseWhere.title", {
                defaultValue: "Где будет проходить ваш проект",
                ns: "host",
            }),
            when: t("main.sidebar.Когда", { ns: "translation" }),
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

    if (step !== "where") {
        return (
            <div className={styles.wrapper}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.description}>
                    {t("hostFundraiseWelcome.stepPlaceholder", { ns: "host" })}
                </p>
            </div>
        );
    }

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
};

export default FundraiseStepPage;
