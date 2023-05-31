import { LocationType, ymapsDefaultLocation } from "constants/ymaps";

import React, { FC, useEffect, useState } from "react";
import {
  Control, Controller, FieldValue, FieldValues,
} from "react-hook-form";
import { Placemark } from "react-yandex-maps";

import Hints from "widgets/Hints/Hints";

import useDebounce from "shared/hooks/useDebounce";
import getGeocodeByName from "shared/lib/ymaps/getGeocodeByName";
import { getHints } from "shared/lib/ymaps/getHints";
import getYmapCoordinates from "shared/lib/ymaps/getYmapCoordinates";
import validateCoordinates from "shared/lib/ymaps/normalizeCoordinates";
import Input from "shared/ui/Input/ui/Input";

import { GeoObjectHintType, YMapType } from "../types/ymaps";
import YandexMap from "../YMap";

import styles from "./YMapWithAddress.module.scss";

interface IYMapWithAddress<
    ControlType extends FieldValues,
    DataType extends { address: string }
> {
    control: Control<ControlType>;
    data: DataType;
    width?: string;
    height?: string;
}

export default function YMapWithAddress<
    ControlType extends FieldValues,
    DataType extends { address: string }
>({
  control, data, width, height,
}: IYMapWithAddress<ControlType, DataType>) {
  const [ymap, setYmap] = useState<YMapType>(null);
  const [address, setAddress] = useState<string>("");
  const [normalizedCoordinates, setNormalizedCoordinates] = useState<LocationType>();
  const [selectedAddresByHint, setSelectedAddressByHint] = useState<boolean>(false);
  const [routesList, setRoutes] = useState<Array<GeoObjectHintType>>([]);

  const debouncedAddress = useDebounce(address, 1000);

  useEffect(() => {
    if (ymap && address.length > 3) {
      validateCoordinates(ymap, debouncedAddress)
        .then((res) => getGeocodeByName(ymap, res))
        .then((res) => getYmapCoordinates(res))
        .then((res) => setNormalizedCoordinates(res));
    }
  }, [ymap, debouncedAddress]);

  useEffect(() => {
    getHints(address).then((hints) => setRoutes(hints));
  }, [address]);

  return (
      <div className={styles.wrapper}>
          <Controller
              control={control as unknown as Control<FieldValues>}
              name="address"
              defaultValue={data.address || ""}
              render={({ field }) => (
                  <Input
                      id="address"
                      label="Адрес"
                      type="text"
                      onFocus={() => setSelectedAddressByHint(false)}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setAddress(e.target.value);
                      }}
                      value={field.value}
                  >
                      {routesList?.length > 0 && (
                      <Hints
                          hints={routesList}
                          selectedAddressByHint={selectedAddresByHint}
                          setAddress={setAddress}
                          setAddressByHint={setSelectedAddressByHint}
                      />
                      )}
                  </Input>
              )}
          />
          <YandexMap
              height={height}
              className={styles.ymap}
              ymap={ymap}
              setYmap={setYmap}
              zoom={12}
              defaultLocation={ymapsDefaultLocation}
              location={normalizedCoordinates}
              modules={["geocode", "geoObject.addon.hint"]}
          >
              {normalizedCoordinates && (
              <Placemark
                  options={{
                    preset: "islands#circleIcon",
                    iconColor: "#0EC261",
                  }}
                  geometry={normalizedCoordinates}
              />
              )}
          </YandexMap>
      </div>
  );
}
