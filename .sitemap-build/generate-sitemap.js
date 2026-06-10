const fs = require("fs");
const path = require("path");

const siteUrl = (process.env.VITE_MAIN_URL || "https://goodsurfing.org").replace(/\/$/, "");
const locales = ["ru", "en", "es"];

const publicStaticPaths = [
    "/",
    "/offers-map",
    "/categories",
    "/membership",
    "/npo",
    "/rules",
    "/about-project",
    "/find-job",
    "/become-host",
    "/blog",
    "/news",
    "/journals",
    "/video",
    "/privacy-policy",
    "/our-team",
    "/ambassadors",
    "/academy-main",
    "/donation-map",
    "/donation-reports",
    "/donation-rating",
];

const normalizePath = (urlPath) => {
    if (!urlPath || urlPath === "/") {
        return "";
    }

    return urlPath.startsWith("/") ? urlPath : `/${urlPath}`;
};

const escapeXml = (value) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const getPriority = (urlPath) => {
    if (urlPath === "" || urlPath === "/") {
        return "1.0";
    }

    return "0.7";
};

const getExtraPaths = () => {
    const extraPathsFile = path.resolve(__dirname, "sitemap-extra-paths.json");

    if (fs.existsSync(extraPathsFile)) {
        return JSON.parse(fs.readFileSync(extraPathsFile, "utf8"));
    }

    if (process.env.SITEMAP_EXTRA_PATHS) {
        return JSON.parse(process.env.SITEMAP_EXTRA_PATHS);
    }

    return [];
};

const buildLocalizedUrls = (paths) => locales.flatMap((locale) => paths.map((urlPath) => {
    const normalizedPath = normalizePath(urlPath);

    return {
        path: `/${locale}${normalizedPath}`,
        changefreq: "weekly",
        priority: getPriority(normalizedPath),
    };
}));

const urls = [
    ...buildLocalizedUrls(publicStaticPaths),
    ...buildLocalizedUrls(getExtraPaths()),
];

const uniqueUrls = Array.from(
    new Map(urls.map((url) => [url.path, url])).values(),
);

const sitemapUrls = uniqueUrls
    .map((url) => `    <url>
        <loc>${escapeXml(`${siteUrl}${url.path}`)}</loc>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`)
    .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`;

fs.writeFileSync(path.resolve(__dirname, "../public/sitemap.xml"), sitemap);
