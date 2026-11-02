/**
 * Какие ссылки принимает видеогалерея (VideoInput старого фронта): YouTube
 * (youtu.be, embed, v, watch), Vimeo (vimeo.com/<число>), VK (vk.com/video…,
 * vk.com/videos…, vkvideo.ru/video…, video_ext.php с oid и id) и Rutube
 * (32 hex). Ссылка проверяется целиком — без пробелов и лишних частей.
 */
const RULES = [
    /^https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))[\w-]{11}\S*$/,
    /^https?:\/\/(?:www\.)?vimeo\.com\/\d+$/,
    /^https?:\/\/(?:www\.)?(?:vk\.com|vkvideo\.ru)\/videos?-?\d+_\d+$/,
    /^https?:\/\/(?:www\.)?(?:vk\.com|vkvideo\.ru)\/video_ext\.php\?\S*\boid=-?\d+\S*$/,
    /^https?:\/\/(?:www\.)?rutube\.ru\/video\/[a-f0-9]{32}(?:\/\S*)?$/,
];

export const isVideoLink = (url: string) => RULES.some((rule) => rule.test(url.trim()));

/** Видео VK: oid и id из video-1_2, videos-1_2 и video_ext.php?oid=-1&id=2 */
export function vkVideoIds(url: string): { oid: string; id: string } | null {
    if (!/(?:^|\/\/|\.)(?:vk\.com|vkvideo\.ru)\//.test(url)) return null;
    const path = url.match(/videos?(-?\d+)_(\d+)/);
    if (path?.[1] && path[2]) return { oid: path[1], id: path[2] };
    const oid = url.match(/[?&]oid=(-?\d+)(?:_(\d+))?/);
    const id = url.match(/[?&]id=(\d+)/);
    if (oid?.[1] && (oid[2] || id?.[1])) return { oid: oid[1], id: oid[2] ?? id?.[1] ?? "" };
    return null;
}
