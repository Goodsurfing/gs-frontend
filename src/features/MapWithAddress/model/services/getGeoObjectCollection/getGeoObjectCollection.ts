import axios from "axios";
import { API_YANDEX_BASE_URL } from "@/shared/constants/api/index";
import { GeoObjectCollection } from "@/entities/Map";
import { Locale } from "@/entities/Locale";

export interface GetGeoObjectsResponse {
    response: {
        GeoObjectCollection: GeoObjectCollection;
    }
}

const languageList: Record<Locale, string> = {
    en: "en_US",
    ru: "ru_RU",
    es: "es_ES",
};

export const getGeoObjectCollection = async (address: string, language: Locale) => {
    try {
        const res = await axios.get<GetGeoObjectsResponse>(`${API_YANDEX_BASE_URL}`, {
            params: {
                apikey: process.env.REACT_APP_API_YANDEX_KEY,
                format: "json",
                geocode: address,
                lang: languageList[language],
            },
        });
        return res.data.response.GeoObjectCollection;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
    }
};

export const getGeoObject = async (address: string) => {
    try {
        const res = await axios.get<GetGeoObjectsResponse>(`${API_YANDEX_BASE_URL}`, {
            params: {
                apikey: process.env.REACT_APP_API_YANDEX_KEY,
                format: "json",
                geocode: address,
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
