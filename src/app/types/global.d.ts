/* eslint-disable @typescript-eslint/naming-convention */
/// <reference types="vite/client" />

declare module "*.svg";

declare module "*.png";

declare module "*.jpg";

declare module "*.webp";

declare module "*.module.scss" {
    const styles: { [key: string]: string };
    export default styles;
}

declare const __IS_DEV__: boolean;

declare module "swiper/css";
declare module "swiper/css/navigation";
declare module "swiper/css/pagination";
declare module "swiper/css/effect-fade";

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_MAIN_URL: string;
    readonly VITE_API_YANDEX_KEY: string;
    readonly VITE_VKID_CLIENT_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
