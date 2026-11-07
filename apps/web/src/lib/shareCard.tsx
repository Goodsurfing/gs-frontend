import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

/**
 * Картинки для соцсетей (только сервер): карточка вакансии для поста (1200×630 —
 * её же берут VK, Telegram, WhatsApp, MAX при вставке ссылки) и для сторис
 * (1080×1920), значок «Мы на Гудсёрфинге» для сайта организатора (600×200, на
 * сайте — 300×100). Без эмодзи и ★: их нет в шрифте, а догружать шрифты
 * при рисовании не хотим. Шрифт — Lato сайта в TTF (рисовальщик не читает woff2),
 * файлы в apps/web/assets/fonts, в образ копируются как словари (Dockerfile).
 */

const FONTS_DIR = path.join(process.cwd(), "assets", "fonts");
let fontsCache: Promise<{ name: string; data: Buffer; weight: 400 | 700; style: "normal" }[]> | null = null;
const fonts = () => {
    fontsCache ??= Promise.all([
        readFile(path.join(FONTS_DIR, "Lato-Regular.ttf")).then((data) => ({ name: "Lato", data, weight: 400 as const, style: "normal" as const })),
        readFile(path.join(FONTS_DIR, "Lato-Bold.ttf")).then((data) => ({ name: "Lato", data, weight: 700 as const, style: "normal" as const })),
    ]);
    return fontsCache;
};

let logoCache: Promise<string> | null = null;
/** Белый логотип (как в подвале сайта) — data URI */
const logo = () => {
    logoCache ??= readFile(path.join(process.cwd(), "public", "web", "icons", "footer", "logo.svg"))
        .then((svg) => `data:image/svg+xml;base64,${svg.toString("base64")}`)
        .catch(() => "");
    return logoCache;
};

/**
 * Фото вакансии — в JPEG нужного размера: рисовальщик не понимает webp (а превью
 * у нас webp), и оригинал бывает в несколько мегабайт. Не получилось — без фото,
 * на фирменном фоне.
 */
async function photo(url: string | undefined, width: number, height: number): Promise<string | null> {
    if (!url) return null;
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(8_000) });
        if (!response.ok) return null;
        const source = Buffer.from(await response.arrayBuffer());
        const sharp = (await import("sharp")).default;
        const jpeg = await sharp(source).resize(width, height, { fit: "cover" }).jpeg({ quality: 78 }).toBuffer();
        return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
    } catch {
        return null;
    }
}

/**
 * Карточка — в JPEG: рисовальщик отдаёт PNG на 0,8–1,4 МБ, а её смотрят и в окне
 * «Поделиться» на телефоне. JPEG того же размера — ~100–200 КБ. Не вышло — PNG.
 */
async function asJpeg(response: ImageResponse): Promise<Response> {
    const png = Buffer.from(await response.arrayBuffer());
    try {
        const sharp = (await import("sharp")).default;
        const jpeg = await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
        return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg", ...CACHE_HEADERS } });
    } catch {
        return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", ...CACHE_HEADERS } });
    }
}

const GREEN = "#0f5f4b";
const ACCENT = "#02CC9B";

export interface OfferCardData {
    title: string;
    place: string | null;
    highlights: string[];
    /** Адрес обложки (оригинал или крупное превью) */
    image?: string;
    /** «goodsurfing.org» — подпись внизу */
    site: string;
    /** «Откликнуться на goodsurfing.org» — для сторис */
    cta: string;
}

const clampTitle = (title: string, max: number) => (title.length > max ? `${title.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : title);

function Chips({ items, size }: { items: string[]; size: number }) {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: size * 0.5 }}>
            {items.slice(0, 4).map((item) => (
                <div key={item} style={{ display: "flex", padding: `${size * 0.3}px ${size * 0.7}px`, borderRadius: size, background: "rgba(255,255,255,0.18)", color: "white", fontSize: size }}>
                    {item}
                </div>
            ))}
        </div>
    );
}

/** Карточка для поста и превью ссылки: фото на весь размер, снизу затемнение с текстом */
export async function offerPostImage(data: OfferCardData): Promise<Response> {
    const [image, logoSrc] = await Promise.all([photo(data.image, 1200, 630), logo()]);
    return asJpeg(new ImageResponse(
        (
            <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", background: GREEN, fontFamily: "Lato" }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- рисуется в картинку */}
                {image && <img loading="eager" src={image} width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover" }} alt="" />}
                <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.85) 100%)" }} />
                {/* eslint-disable-next-line @next/next/no-img-element -- рисуется в картинку */}
                {logoSrc && <img loading="eager" src={logoSrc} width={195} height={63} style={{ position: "absolute", top: 40, left: 56 }} alt="" />}
                <div style={{ position: "absolute", left: 56, right: 56, bottom: 48, display: "flex", flexDirection: "column", gap: 18 }}>
                    <div style={{ display: "flex", fontSize: 60, fontWeight: 700, lineHeight: 1.12, color: "white" }}>{clampTitle(data.title, 70)}</div>
                    {data.place && <div style={{ display: "flex", fontSize: 32, color: "rgba(255,255,255,0.92)" }}>{data.place}</div>}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
                        <Chips items={data.highlights} size={26} />
                        <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: ACCENT, whiteSpace: "nowrap" }}>{data.site}</div>
                    </div>
                </div>
            </div>
        ),
        { width: 1200, height: 630, fonts: await fonts() },
    ));
}

/** Карточка для сторис: фото сверху, снизу фирменная плашка с текстом и призывом */
export async function offerStoryImage(data: OfferCardData): Promise<Response> {
    const [image, logoSrc] = await Promise.all([photo(data.image, 1080, 1180), logo()]);
    return asJpeg(new ImageResponse(
        (
            <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: GREEN, fontFamily: "Lato" }}>
                <div style={{ display: "flex", position: "relative", width: 1080, height: 1180 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- рисуется в картинку */}
                    {image && <img loading="eager" src={image} width={1080} height={1180} style={{ objectFit: "cover" }} alt="" />}
                    <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 25%, rgba(15,95,75,0) 70%, rgba(15,95,75,1) 100%)" }} />
                    {/* eslint-disable-next-line @next/next/no-img-element -- рисуется в картинку */}
                    {logoSrc && <img loading="eager" src={logoSrc} width={260} height={84} style={{ position: "absolute", top: 90, left: 70 }} alt="" />}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "10px 70px 0", marginTop: -8, background: GREEN }}>
                    <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.1, color: "white" }}>{clampTitle(data.title, 80)}</div>
                    {data.place && <div style={{ display: "flex", fontSize: 40, color: "rgba(255,255,255,0.92)" }}>{data.place}</div>}
                    <Chips items={data.highlights} size={34} />
                    <div style={{ display: "flex", marginTop: 24, alignSelf: "flex-start", padding: "22px 44px", borderRadius: 22, background: ACCENT, color: "white", fontSize: 40, fontWeight: 700 }}>{data.cta}</div>
                </div>
            </div>
        ),
        { width: 1080, height: 1920, fonts: await fonts() },
    ));
}

export interface BadgeData {
    name: string;
    rating: number | null;
    reviews: number;
    /** «Мы на Гудсёрфинге» */
    title: string;
    /** «отзывов: 60» — уже с числом */
    reviewsText: string;
    /** «рейтинг {rating}» — значки вроде ★ в шрифте сайта не рисуются */
    ratingText: string;
}

/** Значок для сайта организатора: 600×200 (на сайте — 300×100, чётко на любых экранах) */
export async function organizationBadgeImage(data: BadgeData): Promise<ImageResponse> {
    const logoSrc = await logo();
    const rating = data.rating && data.reviews > 0 ? data.rating.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : null;
    return new ImageResponse(
        (
            <div style={{ display: "flex", alignItems: "center", gap: 28, width: "100%", height: "100%", padding: "0 36px", borderRadius: 28, background: GREEN, fontFamily: "Lato", color: "white" }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- рисуется в картинку */}
                {logoSrc && <img loading="eager" src={logoSrc} width={186} height={60} alt="" />}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                    <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>{data.title}</div>
                    <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.9)" }}>
                        {rating ? `${data.ratingText.replace("{rating}", rating)} · ${data.reviewsText}` : clampTitle(data.name, 28)}
                    </div>
                </div>
            </div>
        ),
        { width: 600, height: 200, fonts: await fonts(), headers: CACHE_HEADERS },
    );
}

/** Картинки меняются редко (новая обложка, новые отзывы) — сутки и ещё неделю из кэша */
const CACHE_HEADERS = { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" };
