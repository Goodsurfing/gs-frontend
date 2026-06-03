// In dev (`npm start`) the SPA must hit the Vite dev-server (which proxies
// to staging) with relative paths — otherwise CORS/IAP kick in. Force an
// empty origin so any value left over in a stray .env / .env.local from
// a developer's previous setup doesn't poison the build.
const API_ORIGIN = import.meta.env.DEV
    ? ""
    : `${import.meta.env.VITE_API_BASE_URL}`.replace(/\/+$/, "");

export const BASE_URL = API_ORIGIN;
export const BASE_URI = "/api/v1/";
export const API_BASE_URL = `${API_ORIGIN}/api/v1/`;
export const API_BASE_URL_V2 = `${API_ORIGIN}/api/v2/`;
export const API_BASE_URL_V3 = `${API_ORIGIN}/api/v3/`;
export const BASE_VK_URI = `${API_ORIGIN}/api/vk/`;
export const API_ADMIN_BASE_URL = `${API_ORIGIN}/admin/v3/`;
export const API_ORGANIZATIONS_BASE_URL = `${API_ORIGIN}/api/organizations/`;
export const API_VACANCY_BASE_URL = `${API_ORIGIN}/api/vacancies/`;
export const API_USER_BASE_URL = `${API_ORIGIN}/api/users/`;
export const API_MEDIA_BASE_URL = `${API_ORIGIN}/api/media_objects/`;
export const API_TRANSLATION_BASE_URL = `${API_ORIGIN}/api/v1/translation`;
export const API_YANDEX_BASE_URL = "https://geocode-maps.yandex.ru/1.x/";
// Used for OAuth/IAP redirect-back URLs. In dev — origin of the running
// dev-server (typically http://localhost:3000), not a baked-in production URL.
export const MAIN_URL = import.meta.env.DEV && typeof window !== "undefined"
    ? window.location.origin
    : `${import.meta.env.VITE_MAIN_URL}`;
