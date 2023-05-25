const API_KEY = "32dcfbe4-583a-4e13-be77-83d32a181111";
export const makeGeoUrl = (geocode: string) => {
  const url = new URL("https://geocode-maps.yandex.ru/1.x");
  const format = "json";
  const geocodeParam = geocode;
  url.searchParams.set("apikey", API_KEY);
  url.searchParams.set("format", format);
  url.searchParams.set("geocode", geocodeParam);
  return url.toString();
};
