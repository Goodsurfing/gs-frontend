import "server-only";

import sanitize from "sanitize-html";

/**
 * HTML статьи из редактора админки и блога — без скриптов, обработчиков и
 * чужих iframe (старый фронт чистил его DOMPurify в браузере). Оформление
 * редактора (style, class) сохраняется.
 */
export function cleanHtml(html: string): string {
    return sanitize(html, {
        allowedTags: [...sanitize.defaults.allowedTags, "img", "h1", "h2", "span", "u", "s", "figure", "figcaption"],
        allowedAttributes: {
            "*": ["style", "class"],
            a: ["href", "target", "rel", "name"],
            img: ["src", "alt", "width", "height"],
        },
        allowedSchemes: ["http", "https", "mailto", "tel"],
        transformTags: {
            // Высота из атрибута — в стиль: базовые стили Tailwind ставят картинкам height: auto,
            // а старый фронт держал заданную редактором высоту (и место под битую картинку)
            img: (tagName, attribs) => {
                const height = Number(attribs.height);
                if (!height) return { tagName, attribs };
                return { tagName, attribs: { ...attribs, style: `height:${height}px;${attribs.style ?? ""}` } };
            },
        },
    });
}
