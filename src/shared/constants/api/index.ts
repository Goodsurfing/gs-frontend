// In dev (`npm start`) the SPA must hit the Vite dev-server (which proxies
// to staging) so CORS/IAP doesn't kick in. We use the running page origin
// (typically http://localhost:3000) — NOT an empty string — because several
// RTK Query endpoints inject API_BASE_URL_ABSOLUTE directly into `url:` while
// using `baseQuery` with baseUrl=API_BASE_URL. Both now point at /api/v1/,
// but RTK still needs the injected one to be an absolute URL: when both are
// relative, RTK naively concatenates them into nonsense like
// `/api/v1/api/v1/profile`. Absolute URLs make RTK's `isAbsoluteUrl` short-
// circuit and use the value verbatim. Browser still hits localhost:3000 so
// the Vite proxy catches it.
const API_ORIGIN = import.meta.env.DEV && typeof window !== "undefined"
    ? window.location.origin
    : `${import.meta.env.VITE_API_BASE_URL}`.replace(/\/+$/, "");

export const BASE_URL = API_ORIGIN;
export const BASE_URI = "/api/v1/";
export const API_BASE_URL = `${API_ORIGIN}/api/v1/`;
export const API_BASE_URL_ABSOLUTE = `${API_ORIGIN}/api/v1/`;
export const BASE_VK_URI = `${API_ORIGIN}/api/v1/vk/`;
export const API_ADMIN_BASE_URL = `${API_ORIGIN}/admin/v1/`;
export const API_ORGANIZATIONS_BASE_URL = `${API_ORIGIN}/api/organizations/`;
export const API_VACANCY_BASE_URL = `${API_ORIGIN}/api/vacancies/`;
export const API_USER_BASE_URL = `${API_ORIGIN}/api/users/`;
export const API_MEDIA_BASE_URL = `${API_ORIGIN}/api/media_objects/`;
export const API_TRANSLATION_BASE_URL = `${API_ORIGIN}/api/v1/translation`;
export const API_YANDEX_BASE_URL = `${API_ORIGIN}/api/v1/geocode`;
// Used for OAuth/IAP redirect-back URLs. In dev — origin of the running
// dev-server (typically http://localhost:3000), not a baked-in production URL.
export const MAIN_URL = import.meta.env.DEV && typeof window !== "undefined"
    ? window.location.origin
    : `${import.meta.env.VITE_MAIN_URL}`;
