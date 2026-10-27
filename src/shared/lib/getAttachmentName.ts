import { AttachedFile } from "@/types/media";

/**
 * Имя файла для показа пользователю: исходное имя, с которым его загрузили,
 * а для старых файлов (без name) — последний сегмент адреса, как раньше.
 */
export const getAttachmentName = (file: Pick<AttachedFile, "contentUrl" | "name">): string => {
    if (file.name) return file.name;

    const lastSegment = file.contentUrl.split("/").pop();
    if (!lastSegment) return "Файл";

    try {
        return decodeURIComponent(lastSegment);
    } catch {
        return lastSegment;
    }
};
