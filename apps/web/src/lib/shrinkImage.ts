/**
 * Фото перед загрузкой — уменьшить на телефоне, а не слать оригинал: снимок
 * камеры 4–5 МБ на медленном интернете грузится десятки секунд, а на сайте
 * аватар показывается не больше 300 px. Не получилось (HEIC в Chrome, старый
 * браузер) — отдаём файл как есть, сервер проверит сам.
 */
export const SHRINK_MAX_SIDE = 1024;
const QUALITY = 0.85;

/** Размер, вписанный в квадрат max×max, с сохранением пропорций; меньше — не увеличиваем */
export function fitSize(width: number, height: number, max = SHRINK_MAX_SIDE): { width: number; height: number } {
    const scale = Math.min(1, max / Math.max(width, height));
    return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export async function shrinkImage(file: File, max = SHRINK_MAX_SIDE): Promise<File> {
    if (!file.type.startsWith("image/") || file.type === "image/gif" || typeof createImageBitmap !== "function") return file;
    try {
        const bitmap = await createImageBitmap(file);
        const size = fitSize(bitmap.width, bitmap.height, max);
        if (size.width === bitmap.width && file.size < 400 * 1024) {
            bitmap.close();
            return file;
        }
        const canvas = document.createElement("canvas");
        canvas.width = size.width;
        canvas.height = size.height;
        canvas.getContext("2d")?.drawImage(bitmap, 0, 0, size.width, size.height);
        bitmap.close();
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
        if (!blob || blob.size >= file.size) return file;
        return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
    } catch {
        return file;
    }
}
