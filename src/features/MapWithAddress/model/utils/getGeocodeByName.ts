import { makeGeoUrl } from "./makeGeoUrl";

export const getGeocodeByName = async (value: string) => {
    if (value.length < 3) {
        return;
    }
    const data = await fetch(makeGeoUrl(value))
        .then((res) => { return res.json(); })
        .then((data) => { return data.response.GeoObjectCollection.featureMember; });
    return data;
};
