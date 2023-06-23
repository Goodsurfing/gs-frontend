export const makeGeoUrl = (geocode: string) => {
    const url = new URL("https://geocode-maps.yandex.ru/1.x");
    const format = "json";
    const geocodeParam = geocode;
    url.searchParams.set("apikey", process.env.REACT_APP_API_YANDEX_KEY || "");
    url.searchParams.set("format", format);
    url.searchParams.set("geocode", geocodeParam);
    return url.toString();
};
