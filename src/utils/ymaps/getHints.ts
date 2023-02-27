import { makeGeoUrl } from "../url/ymapUrlHelpers";

export const getHints = async (value: string) => {
    if (value.length < 3) {
        return;
    }
    const data = await fetch(makeGeoUrl(value))
        .then((res) => res.json())
        .then(data => data.response.GeoObjectCollection.featureMember);
    return data;
}