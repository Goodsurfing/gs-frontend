import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { MapWithAddress, getGeoObjectByCoordinates } from "@/features/MapWithAddress";
import { AddressFormFormFields } from "@/features/Offer";
import {
    useGetDonationAddressQuery,
    useUpdateDonationAddressMutation,
} from "@/entities/Donation";
import { FUNDRAISE_WHERE_FORM } from "@/shared/constants/localstorage";
import Button from "@/shared/ui/Button/Button";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getErrorText } from "@/shared/lib/getErrorText";

import styles from "./FundraiseStepPage.module.scss";

const FundraiseStepPage = () => {
    const { t } = useTranslation(["host", "translation"]);
    const { step, id } = useParams<{ step: string; id: string }>();
    const [toast, setToast] = useState<ToastAlert>();

    const {
        handleSubmit,
        formState: { errors, isDirty },
        control,
        reset,
        watch,
    } = useForm<AddressFormFormFields>({
        mode: "onChange",
        defaultValues: {
            address: {
                address: "",
                geoObject: null,
            },
        },
    });

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

    const loadGeoObject = useCallback(async (latitude: number, longitude: number) => {
        const geoObject = await getGeoObjectByCoordinates(longitude, latitude);

        if (!geoObject) {
            return {
                address: {
                    address: "",
                    geoObject: null,
                },
            };
        }

        return {
            address: {
                address: `${geoObject.description ? `${geoObject.description}, ` : ""}${geoObject.name}`,
                geoObject: {
                    name: geoObject.name,
                    description: geoObject.description,
                    Point: {
                        pos: `${longitude} ${latitude}`,
                    },
                },
            },
        };
    }, []);

    useEffect(() => {
        if (step !== "where" || !id) {
            return;
        }

        const saved = sessionStorage.getItem(`${FUNDRAISE_WHERE_FORM}${id}`);
        if (saved) {
            try {
                reset(JSON.parse(saved));
                return;
            } catch {
                sessionStorage.removeItem(`${FUNDRAISE_WHERE_FORM}${id}`);
            }
        }

        if (donationAddress?.latitude && donationAddress?.longitude) {
            loadGeoObject(donationAddress.latitude, donationAddress.longitude).then((data) => {
                reset(data);
            });
        }
    }, [step, id, donationAddress, loadGeoObject, reset]);

    useEffect(() => {
        if (!id || step !== "where") {
            return;
        }

        if (isDirty) {
            sessionStorage.setItem(`${FUNDRAISE_WHERE_FORM}${id}`, JSON.stringify(watch()));
        }
    }, [id, isDirty, step, watch]);

    const onSubmitWhere = handleSubmit(async (data) => {
        if (!id) {
            return;
        }

        const pos = data.address.geoObject?.Point.pos || "";
        const [longitude, latitude] = pos.split(" ").map(Number);

        if (!data.address.geoObject || Number.isNaN(longitude) || Number.isNaN(latitude)) {
            return;
        }

        try {
            await updateDonationAddress({
                id,
                body: {
                    address: data.address.address,
                    longitude,
                    latitude,
                },
            }).unwrap();

            sessionStorage.removeItem(`${FUNDRAISE_WHERE_FORM}${id}`);
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
    });

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
            <form className={styles.form} onSubmit={onSubmitWhere}>
                <Controller
                    control={control}
                    name="address"
                    rules={{
                        validate: (value) => value?.geoObject !== null || t("hostFundraiseWhere.addressRequired", {
                            defaultValue: "Укажите адрес",
                            ns: "host",
                        }),
                    }}
                    render={({ field }) => (
                        <MapWithAddress
                            field={field}
                            onCoordinatesChange={(coords) => coords}
                        />
                    )}
                />

                {errors.address && (
                    <p className={styles.error}>{errors.address.message}</p>
                )}

                <div className={styles.actions}>
                    <Button
                        variant="FILL"
                        color="BLUE"
                        size="MEDIUM"
                        type="submit"
                        onClick={onSubmitWhere}
                        disabled={isSaving || isLoadingAddress}
                    >
                        {t("Сохранить", { ns: "offer" })}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FundraiseStepPage;
