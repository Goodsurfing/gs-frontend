import React, {
    memo, useCallback, useEffect, useState,
} from "react";

import cn from "classnames";

import { Placemark } from "@pbe/react-yandex-maps";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Control, Controller } from "react-hook-form";
import { YMap, YmapType, GeoObject } from "@/entities/Map";

import locationIcon from "@/shared/assets/icons/location.svg";

import useDebounce from "@/shared/hooks/useDebounce";

import { getGeoObjectCollection } from "../model/services/getGeoObjectCollection/getGeoObjectCollection";

import AutoComplete from "@/shared/ui/AutoComplete/AutoComplete";

import styles from "./MapWithAddress.module.scss";
import { validateCoordinates } from "../model/utils/validateCoordinates";

interface MapWithAddressProps {
    className?: string;
    data: { address: string };
    control: Control<{ address: string }>;
}

const MapWithAddress = (
    {
        className,
        data,
        control,
    }: MapWithAddressProps,
) => {
    const [ymap, setYmap] = useState<YmapType | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const [value, setValue] = useState<GeoObject | null>(null);
    const [options, setOptions] = useState<readonly GeoObject[]>([]);
    const [inputValue, setInputValue] = useState("");

    const debouncedAddress = useDebounce(inputValue, 300);

    const handleValueChange = useCallback((newValue: GeoObject | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
    }, [options]);

    useEffect(() => {
        let active = true;

        if (!ymap) {
            return undefined;
        }

        if (debouncedAddress === "") {
            setOptions(value ? [value] : []);
            return undefined;
        }

        if (active) {
            let newOptions: readonly GeoObject[] = [];
            if (value) {
                newOptions = [value];
            }
            getGeoObjectCollection(debouncedAddress).then((res) => {
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
    }, [value, ymap, debouncedAddress]);

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.content}>
                <Controller
                    name="address"
                    defaultValue={data.address || ""}
                    control={control}
                    render={({ field }) => (
                        <AutoComplete
                            value={value}
                            inputValue={field.value}
                            onChange={handleValueChange}
                            onInputChange={(inputVal) => {
                                field.onChange(inputVal);
                                setInputValue(inputVal);
                            }}
                            options={options}
                            getOptionLabel={(option) => option.name}
                            noOptionsText="Точек на карте не найдено"
                            labelText="Введите адрес"
                            renderOption={(props, option) => (
                                <li key={option.name} {...props}>
                                    <Grid item sx={{ display: "flex", width: 30 }}>
                                        <img src={locationIcon} alt="location" />
                                    </Grid>
                                    <Grid item sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}>
                                        <Box component="span">{option.name}</Box>
                                        <Typography variant="body2">
                                            {option.description}
                                        </Typography>
                                    </Grid>
                                </li>
                            )}
                        />
                    )}
                />
                <YMap
                    mapState={{
                        center: validateCoordinates(value?.Point.pos),
                        zoom: 10,
                    }}
                    className={cn(styles.map, {
                        [styles.loading]: !loading,
                    })}
                    setYmap={(ymaps) => setYmap(ymaps)}
                    setLoading={setLoading}
                >
                    <Placemark
                        geometry={validateCoordinates(value?.Point.pos)}
                    />
                </YMap>
            </div>
        </div>
    );
};

export const MemoMapWithAddress = memo(MapWithAddress);
