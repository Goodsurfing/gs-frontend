/**
 * Фото первого экрана главной (HeroSlider): полное — для экранов шире 768 px,
 * вертикальная вырезка середины кадра — для телефонов (их экран показывает
 * только середину, а файл в разы меньше), и размытое превью 24 px в data URL
 * (меньше 200 байт) — оно в HTML и видно сразу, пока на медленном интернете
 * грузится фото. Вырезки и превью сделаны Pillow из исходных slide-*.webp.
 */
export interface HeroImage {
    src: string;
    mobile: string;
    placeholder: string;
}

const image = (name: string, placeholder: string): HeroImage => ({
    src: `/web/images/home/${name}.webp`,
    mobile: `/web/images/home/${name}-mobile.webp`,
    placeholder,
});

export const HERO_IMAGES = {
    volunteers: image("slide-1", "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAABQBQCdASoYABkAPu1mq0+ppSOiMBgIATAdiWcAxNgQOZLIRqfH02oLISyU30NDDX/qrAAA/M78RvSMhvoXzzbnuZ08vKqJyoelQY0BEZWQ4LIhYqmnBbIHBzvhLzlXJcKGhVHLGN7SQFAA"),
    hosts: image("slide-2", "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAwCdASoYAA0APu1mq04ppaQiMAgBMB2JYwCdIMgDApHB34WQKlQAAPx9qr+42qibt2LUNXChtRIzGnDctHEW0qJeJx7b9WvLJagA"),
} satisfies Record<string, HeroImage>;
