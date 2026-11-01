/**
 * Встроенное видео по ссылке (VideoPlayer старого фронта): ВКонтакте, Rutube,
 * YouTube, Vimeo и прямые файлы. Неизвестная ссылка — подпись об ошибке.
 */
export function embedUrl(url: string): { kind: "iframe" | "file"; src: string } | null {
    const vk = url.match(/video(-?\d+)_(\d+)/);
    if ((url.includes("vk.com") || url.includes("vkvideo.ru")) && vk) {
        return { kind: "iframe", src: `https://vk.com/video_ext.php?oid=${vk[1]}&id=${vk[2]}&hd=2&autoplay=0` };
    }
    const rutube = url.match(/rutube\.ru\/video\/([a-f0-9-]+)/i);
    if (rutube) return { kind: "iframe", src: `https://rutube.ru/play/embed/${rutube[1]}` };
    const youtube = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
    if (youtube) return { kind: "iframe", src: `https://www.youtube.com/embed/${youtube[1]}` };
    const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeo) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };
    if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) return { kind: "file", src: url };
    return null;
}

export function VideoEmbed({ url, height = 180, title, unsupported }: { url: string; height?: number; title: string; unsupported: string }) {
    const embed = embedUrl(url);
    if (!embed) return <div className="flex items-center justify-center text-center" style={{ height }}><p>{unsupported}</p></div>;
    if (embed.kind === "file") {
        return <video src={embed.src} controls className="block w-full" style={{ height }} />;
    }
    return (
        <iframe
            title={title}
            src={embed.src}
            width="100%"
            height={height}
            className="block border-0"
            loading="lazy"
            allow="encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
            allowFullScreen
        />
    );
}
