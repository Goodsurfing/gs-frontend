import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { getGeoObjectByCoordinates } from "@/features/MapWithAddress";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getAdminVacancyWhenPageUrl } from "@/shared/config/routes/AppUrls";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import {
    offerWhereApiAdapter,
    useGetAdminVacancyWhereQuery, useUpdateAdminVacancyWhereMutation,
} from "@/entities/Admin";
import { OFFER_WHERE_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";
import { AddressFormFormFields, OfferWhereForm } from "@/features/Offer";

interface AdminOfferWhereProps {
    className?: string;
    offerId: string;
}

export const AdminOfferWhere: FC<AdminOfferWhereProps> = (props) => {
    const { className, offerId } = props;

    const [initialDataForm, setInitialDataForm] = useState<AddressFormFormFields | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();
    const { t } = useTranslation("offer");

    const [updateOfferWhere, { isLoading: isLoadingUpdate }] = useUpdateAdminVacancyWhereMutation();
    const { data: offerWhereData, isLoading: isLoadingGet } = useGetAdminVacancyWhereQuery(offerId);

    const hasSavedDataInSession = useCallback(
        () => sessionStorage.getItem(`${OFFER_WHERE_FORM}${offerId}`) !== null,
        [offerId],
    );

    const fetchGeoObject = useCallback(async (whereData: any) => {
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
        return null;
    }, []);

    useEffect(() => {
        setHasUnsavedChanges(hasSavedDataInSession());

        const loadInitialData = async () => {
            const savedData = sessionStorage.getItem(`${OFFER_WHERE_FORM}${offerId}`);
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    setInitialDataForm(parsed);
                } catch {
                    setInitialDataForm(null);
                }
            } else if (offerWhereData) {
                const adapted = await fetchGeoObject(offerWhereData);
                setInitialDataForm(adapted || null);
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
    }, [offerId, fetchGeoObject, hasSavedDataInSession, offerWhereData]);

    const onSubmit = async (data: AddressFormFormFields) => {
        setToast(undefined);
        const preparedData = offerWhereApiAdapter(data);
        try {
            await updateOfferWhere({ offerId, body: preparedData });
            setToast({
                text: t("where.Адрес успешно изменён"),
                type: HintType.Success,
            });
        } catch (error: unknown) {
            setToast({
                text: getErrorText(error),
                type: HintType.Error,
            });
        }
    };

    const onFormChange = (isDirty: boolean) => {
        setHasUnsavedChanges(isDirty);
    };

    if (isLoadingGet) {
        return (
            <div className={className}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <OfferWhereForm
                initialData={initialDataForm}
                onComplete={onSubmit}
                onFormChange={onFormChange}
                isLoadingGetData={isLoadingGet}
                isLoadingUpdateData={isLoadingUpdate}
                linkNext={getAdminVacancyWhenPageUrl(locale, offerId)}
                hasUnsavedChanges={hasUnsavedChanges}
                className={className}
                offerId={offerId}
            />
        </>
    );
};
