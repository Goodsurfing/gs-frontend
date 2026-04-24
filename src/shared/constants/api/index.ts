const API_ORIGIN = `${import.meta.env.VITE_API_BASE_URL}`.replace(/\/+$/, "");

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
export const MAIN_URL = `${import.meta.env.VITE_MAIN_URL}`;
