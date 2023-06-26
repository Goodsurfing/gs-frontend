import type { YMapsApi } from "react-yandex-maps";

export default function getYmapCoordinates(ymapGeocodeRequest: YMapsApi) {
    try {
        const res = ymapGeocodeRequest.geoObjects
            .get(0)
            .geometry.getCoordinates();
        return res;
    } catch (e) {
        console.log(e);
    }
}
