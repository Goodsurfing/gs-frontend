import { describe, expect, it } from "vitest";

import { jsonLdGraph } from "../structuredData";

describe("jsonLdGraph", () => {
    it("один объект с @context и @graph, у узлов @context убран", () => {
        const graph = jsonLdGraph([
            { "@context": "https://schema.org", "@type": "WebSite", name: "GoodSurfing" },
            { "@context": "https://schema.org", "@type": "Organization", name: "GoodSurfing" },
        ]);
        expect(Array.isArray(graph)).toBe(false);
        expect(graph["@context"]).toBe("https://schema.org");
        expect(graph["@graph"]).toEqual([{ "@type": "WebSite", name: "GoodSurfing" }, { "@type": "Organization", name: "GoodSurfing" }]);
    });
});
