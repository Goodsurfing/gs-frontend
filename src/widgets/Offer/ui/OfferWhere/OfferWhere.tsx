import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { AddressFormFormFields, OfferWhereForm, offerWhereFormApiAdapter } from "@/features/Offer";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useGetOfferByIdQuery, useUpdateOfferMutation } from "@/entities/Offer";
import { getErrorText } from "@/shared/lib/getErrorText";
import { OFFER_WHERE_FORM } from "@/shared/constants/localstorage";
import { getGeoObjectByCoordinates } from "@/features/MapWithAddress";
import { getOffersWhenPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface OfferWhereProps {
    className?: string;
    offerId: string;
}

export const OfferWhere: FC<OfferWhereProps> = (props) => {
    const { offerId, className } = props;

    const [initialDataForm, setInitialDataForm] = useState<AddressFormFormFields | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const [updateOffer, { isLoading: isLoadingUpdate }] = useUpdateOfferMutation();
    const { data: offerData, isLoading: isLoadingGet } = useGetOfferByIdQuery(offerId);

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
            } else if (offerData?.where) {
                const adapted = await fetchGeoObject(offerData.where);
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
    }, [offerData, offerId, fetchGeoObject, hasSavedDataInSession]);

    const onSubmit = async (data: AddressFormFormFields) => {
        setToast(undefined);
        const preparedData = offerWhereFormApiAdapter(data);
        try {
            await updateOffer({ id: Number(offerId), body: { where: preparedData } }).unwrap();
            setToast({ text: "Адрес успешно изменён", type: HintType.Success });
            sessionStorage.removeItem(`${OFFER_WHERE_FORM}${offerId}`);
            setHasUnsavedChanges(false);
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    const onFormChange = (isDirty: boolean) => {
        setHasUnsavedChanges(isDirty);
    };

    return (
        <>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <OfferWhereForm
                initialData={initialDataForm}
                onComplete={onSubmit}
                onFormChange={onFormChange}
                isLoadingGetData={isLoadingGet}
                isLoadingUpdateData={isLoadingUpdate}
                linkNext={getOffersWhenPageUrl(locale, offerId)}
                hasUnsavedChanges={hasUnsavedChanges}
                className={className}
                offerId={offerId}
            />
        </>
    );
};
