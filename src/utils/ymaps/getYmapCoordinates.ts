import { YMapsApi } from "react-yandex-maps";

export default function getYmapCoordinates(ymapGeocodeRequest: YMapsApi) {
    return ymapGeocodeRequest.geoObjects.get(0).geometry.getCoordinates();
}