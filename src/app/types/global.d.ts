declare module '*.module.scss' {
  const styles: { [key: string]: string };
  export default styles;
}

declare module '*.svg'

declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.jpeg';

declare module '*.jpg';

declare module '*.gif';

// eslint-disable-next-line no-unused-vars
declare const __IS_DEV__: boolean;
