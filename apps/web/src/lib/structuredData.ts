type JsonLdNode = Record<string, unknown>;

/**
 * Разметка schema.org одним объектом с @graph вместо массива: сторонние
 * скрипты (расширения, встроенные браузеры приложений) читают json-ld как
 * объект и на массиве падали «undefined is not an object (evaluating
 * 'r["@context"].toLowerCase')». Поисковики понимают @graph так же, как массив.
 */
export function jsonLdGraph(nodes: JsonLdNode[]): JsonLdNode {
    return {
        "@context": "https://schema.org",
        "@graph": nodes.map((node) => Object.fromEntries(Object.entries(node).filter(([key]) => key !== "@context"))),
    };
}
