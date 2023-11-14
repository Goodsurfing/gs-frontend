import axios from "axios";
import { API_YANDEX_BASE_URL } from "@/shared/constants/api/index";
import { GeoObjectCollection } from "@/entities/Map";

export interface GetGeoObjectsResponse {
    response: {
        GeoObjectCollection: GeoObjectCollection;
    }
}

export const getGeoObjectCollection = async (address: string) => {
    try {
        const res = await axios.get<GetGeoObjectsResponse>(`${API_YANDEX_BASE_URL}`, {
            params: {
                apikey: process.env.REACT_APP_API_YANDEX_KEY,
                format: "json",
                geocode: address,
            },
        });
        return res.data.response.GeoObjectCollection;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
    }
};
