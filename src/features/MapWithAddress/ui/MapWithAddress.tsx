import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Placemark } from "@pbe/react-yandex-maps";
import cn from "classnames";
import React, {
    memo, useCallback, useEffect, useState,
} from "react";
import { ControllerRenderProps } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { GeoObject, YMap, YmapType } from "@/entities/Map";

import locationIcon from "@/shared/assets/icons/location.svg";
import useDebounce from "@/shared/hooks/useDebounce";
import AutoComplete from "@/shared/ui/AutoComplete/AutoComplete";

import { validateCoordinates } from "../model/lib/validateCoordinates";
import { getGeoObjectCollection } from "../model/services/getGeoObjectCollection/getGeoObjectCollection";
import styles from "./MapWithAddress.module.scss";
import { AddressFormFormFields } from "@/widgets/AddressForm/model/types/addressForm";

interface MapWithAddressProps {
    className?: string;
    field: ControllerRenderProps<AddressFormFormFields, "address">;
    onCoordinatesChange: (coordinates: string | undefined) => void;
}

const MapWithAddress = ({
    className,
    onCoordinatesChange,
    field,
}: MapWithAddressProps) => {
    const { t } = useTranslation("offer");
    const { locale } = useLocale();
    const [ymap, setYmap] = useState<YmapType | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<readonly GeoObject[]>([]);

    const debouncedAddress = useDebounce(field.value.address, 300);

    const handleValueChange = useCallback(
        (newValue: GeoObject | null) => {
            setOptions(newValue ? [newValue, ...options] : options);
            field.onChange({ ...field.value, geoObject: newValue });
        },
        [field, options],
    );

    useEffect(() => {
        onCoordinatesChange(field.value.geoObject?.Point.pos);
    }, [onCoordinatesChange, field.value.geoObject?.Point.pos]);

    useEffect(() => {
        let active = true;

        if (!ymap) {
            return undefined;
        }

        if (debouncedAddress === "") {
            setOptions(field.value.geoObject ? [field.value.geoObject] : []);
            return undefined;
        }

        if (active) {
            let newOptions: readonly GeoObject[] = [];
            if (field.value.geoObject) {
                newOptions = [field.value.geoObject];
            }
            getGeoObjectCollection(debouncedAddress, locale).then((res) => {
                if (res?.featureMember.length) {
                    newOptions = [
                        ...newOptions,
                        ...res.featureMember.map((item) => item.GeoObject),
                    ];
                    setOptions(newOptions);
                }
            });
        }

        return () => {
            active = false;
        };
    }, [ymap, debouncedAddress, locale, field.value.geoObject]);

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.content}>
                <AutoComplete
                    value={field.value.geoObject}
                    inputValue={field.value.address}
                    onChange={handleValueChange}
                    onInputChange={(inputVal) => {
                        field.onChange({ ...field.value, address: inputVal });
                    }}
                    options={options}
                    getOptionLabel={(option) => `${option.description} ${option.name}`}
                    noOptionsText={t("where.Точек на карте не найдено")}
                    labelText={t("where.Введите адрес")}
                    renderOption={(props, option) => (
                        <li key={option.name} {...props}>
                            <Grid item sx={{ display: "flex", width: 30 }}>
                                <img src={locationIcon} alt="location" />
                            </Grid>
                            <Grid
                                item
                                sx={{
                                    width: "calc(100% - 44px)",
                                    wordWrap: "break-word",
                                }}
                            >
                                <Box component="span">{option.name}</Box>
                                <Typography variant="body2">
                                    {option.description}
                                </Typography>
                            </Grid>
                        </li>
                    )}
                />
                <YMap
                    locale={locale}
                    mapState={{
                        center: validateCoordinates(field.value.geoObject?.Point.pos),
                        zoom: 10,
                    }}
                    className={cn(styles.map, {
                        [styles.loading]: !loading,
                    })}
                    setYmap={(ymaps) => setYmap(ymaps)}
                    setLoading={setLoading}
                >
                    <Placemark
                        geometry={validateCoordinates(field.value.geoObject?.Point.pos)}
                    />
                </YMap>
            </div>
        </div>
    );
};

export const MemoMapWithAddress = memo(MapWithAddress);
