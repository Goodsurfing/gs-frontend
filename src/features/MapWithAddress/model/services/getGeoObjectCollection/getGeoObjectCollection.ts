import axios from "axios";

import { Locale } from "@/entities/Locale";
import { GeoObject, GeoObjectCollection } from "@/entities/Map";

import { API_YANDEX_BASE_URL } from "@/shared/constants/api/index";

export interface GetGeoObjectsResponse {
    response: {
        GeoObjectCollection: GeoObjectCollection;
    };
}

const languageList: Record<Locale, string> = {
    en: "en_US",
    ru: "ru_RU",
    es: "es_ES",
};

export const getGeoObjectCollection = async (
    address: string,
    language: Locale,
) => {
    try {
        const res = await axios.get<GetGeoObjectsResponse>(
            `${API_YANDEX_BASE_URL}`,
            {
                params: {
                    apikey: process.env.REACT_APP_API_YANDEX_KEY,
                    format: "json",
                    geocode: address,
                    lang: languageList[language],
                },
            },
        );
        return res.data.response.GeoObjectCollection;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
    }
};

export const getGeoObjectByAddress = async (address: string) => {
    try {
        const res = await axios.get<GetGeoObjectsResponse>(
            `${API_YANDEX_BASE_URL}`,
            {
                params: {
                    apikey: process.env.REACT_APP_API_YANDEX_KEY,
                    format: "json",
                    geocode: address,
                },
            },
        );
        const geoObjectCollection = res.data.response.GeoObjectCollection;

        if (geoObjectCollection.featureMember.length > 0) {
            const firstGeoObject = geoObjectCollection.featureMember[0].GeoObject;

            return firstGeoObject;
        }
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
    }
};

export const getGeoObjectByCoordinates = async (
    longitude: number,
    latitude: number,
): Promise<GeoObject | undefined> => {
    try {
        const res = await axios.get(`${API_YANDEX_BASE_URL}`, {
            params: {
                apikey: process.env.REACT_APP_API_YANDEX_KEY,
                format: "json",
                geocode: `${longitude},${latitude}`,
            },
        });
        const geoObjectCollection = res.data.response.GeoObjectCollection;

        if (geoObjectCollection.featureMember.length > 0) {
            const firstGeoObject = geoObjectCollection.featureMember[0].GeoObject;
            return firstGeoObject;
        }
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
    }
};
