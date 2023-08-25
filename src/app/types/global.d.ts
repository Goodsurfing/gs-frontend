/* eslint-disable @typescript-eslint/naming-convention */
declare module "*.svg";

declare module "*.png";

declare module "*.jpg";

declare module "*.module.scss" {
    const styles: { [key: string]: string };
    export default styles;
}

declare const __IS_DEV__: boolean;

