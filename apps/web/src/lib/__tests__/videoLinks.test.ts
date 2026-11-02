import { describe, expect, it } from "vitest";

import { embedUrl } from "@/components/video/VideoEmbed";

import { isVideoLink, vkVideoIds } from "../videoLinks";

describe("ссылки на видео", () => {
    it("принимает YouTube, Vimeo, VK и Rutube", () => {
        for (const url of [
            "https://youtu.be/dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10",
            "https://youtube.com/watch?feature=share&v=dQw4w9WgXcQ",
            "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "https://vimeo.com/123456",
            "https://vk.com/video-123_456",
            "https://vk.com/videos-123_456",
            "https://vkvideo.ru/video-123_456",
            "https://vkvideo.ru/video_ext.php?oid=-123&id=456&hash=abc",
            "https://rutube.ru/video/0123456789abcdef0123456789abcdef/",
        ]) expect(isVideoLink(url), url).toBe(true);
    });

    it("отвергает прочее", () => {
        for (const url of ["", "youtube.com/watch?v=dQw4w9WgXcQ", "https://vimeo.com/abc", "https://vk.com/id1", "https://rutube.ru/video/123", "https://example.com/a b"]) {
            expect(isVideoLink(url), url).toBe(false);
        }
    });

    it("VK: oid и id из любого вида ссылки — плеер их показывает", () => {
        expect(vkVideoIds("https://vk.com/videos-1_2")).toEqual({ oid: "-1", id: "2" });
        expect(vkVideoIds("https://vkvideo.ru/video_ext.php?oid=-1&id=2&hash=x")).toEqual({ oid: "-1", id: "2" });
        expect(vkVideoIds("https://example.com/video-1_2")).toBeNull();
        expect(embedUrl("https://vkvideo.ru/video_ext.php?oid=-1&id=2")?.src).toBe("https://vk.com/video_ext.php?oid=-1&id=2&hd=2&autoplay=0");
    });
});
