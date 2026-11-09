/**
 * Уменьшение фото в браузере перед загрузкой.
 *
 * Фото с телефона — 12–50 Мп и 3–10 МБ, а сервер всё равно хранит оригинал
 * не больше 1920 px по длинной стороне (media.max_original_dimension в
 * gs-backend). Уменьшаем заранее: на медленном мобильном интернете это в
 * разы меньше трафика, а серверу не нужно разбирать огромную картинку
 * (09.11.2026 фото на десятки мегапикселей уронило загрузку ошибкой памяти).
 *
 * Любая ошибка (старый браузер, битый файл) — отправляем исходный файл,
 * как раньше: сервер умеет уменьшать и сам.
 */

/** Как media.max_original_dimension на сервере */
export const MAX_IMAGE_SIDE = 1920;

/** Файлы меньше этого и в пределах размера не трогаем */
const SMALL_ENOUGH_BYTES = 1.5 * 1024 * 1024;

const JPEG_QUALITY = 0.85;

/** GIF (анимация) и SVG не трогаем */
const SHRINKABLE = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

/** Размер после уменьшения с сохранением пропорций; не увеличивает */
export function targetSize(width: number, height: number, maxSide = MAX_IMAGE_SIDE): { width: number; height: number } {
    const longest = Math.max(width, height);
    if (longest <= maxSide) return { width, height };
    const scale = maxSide / longest;
    return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

/** PNG остаётся PNG (прозрачность), остальное — JPEG */
export function outputType(inputType: string): "image/png" | "image/jpeg" {
    return inputType === "image/png" ? "image/png" : "image/jpeg";
}

/** «IMG_0001.HEIC.png» → «IMG_0001.HEIC.jpg» для смены формата */
export function renameForType(name: string, type: "image/png" | "image/jpeg"): string {
    const extension = type === "image/png" ? ".png" : ".jpg";
    return /\.[^./]+$/.test(name) ? name.replace(/\.[^./]+$/, extension) : `${name}${extension}`;
}

export async function downscaleImage(file: File, maxSide = MAX_IMAGE_SIDE): Promise<File> {
    if (!SHRINKABLE.has(file.type) || typeof createImageBitmap !== "function") return file;
    let bitmap: ImageBitmap | null = null;
    try {
        // from-image — с учётом поворота из EXIF (фото с телефона часто «лежат на боку»)
        bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
        const size = targetSize(bitmap.width, bitmap.height, maxSide);
        const resized = size.width !== bitmap.width || size.height !== bitmap.height;
        if (!resized && file.size <= SMALL_ENOUGH_BYTES) return file;

        const type = outputType(file.type);
        const blob = await draw(bitmap, size.width, size.height, type);
        if (!blob || (!resized && blob.size >= file.size)) return file;
        return new File([blob], renameForType(file.name, type), { type, lastModified: file.lastModified });
    } catch {
        return file;
    } finally {
        bitmap?.close();
    }
}

async function draw(bitmap: ImageBitmap, width: number, height: number, type: string): Promise<Blob | null> {
    if (typeof OffscreenCanvas !== "undefined") {
        const canvas = new OffscreenCanvas(width, height);
        const context = canvas.getContext("2d");
        if (!context) return null;
        context.drawImage(bitmap, 0, 0, width, height);
        return await canvas.convertToBlob({ type, quality: JPEG_QUALITY });
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.drawImage(bitmap, 0, 0, width, height);
    return await new Promise((resolve) => canvas.toBlob(resolve, type, JPEG_QUALITY));
}
