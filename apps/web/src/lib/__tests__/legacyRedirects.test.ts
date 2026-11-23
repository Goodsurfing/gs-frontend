import { describe, expect, it } from "vitest";

import { legacyBackendPath, legacyRedirect } from "../legacyRedirects";

describe("старые адреса — 301 с сервера", () => {
    it("адреса *-personal старого SPA", () => {
        expect(legacyRedirect("/offer-personal/5561")).toBe("/offers/5561");
        expect(legacyRedirect("/en/offer-personal/5561")).toBe("/en/offers/5561");
        expect(legacyRedirect("/host-personal/019dbeab-7f91-714c-a8e5-a669569e2d63")).toBe("/organizations/019dbeab-7f91-714c-a8e5-a669569e2d63");
        expect(legacyRedirect("/es/volunteer-personal/019dbe7e-8111-708f-b122-095f414d8ad1/")).toBe("/es/volunteers/019dbe7e-8111-708f-b122-095f414d8ad1");
        expect(legacyRedirect("/donation-personal/0a1b")).toBe("/fundraise/0a1b");
    });

    it("списки вакансий старого сайта — на карту", () => {
        expect(legacyRedirect("/offers/index")).toBe("/offers-map");
        expect(legacyRedirect("/offers/host")).toBe("/offers-map");
        expect(legacyRedirect("/en/offers/index")).toBe("/en/offers-map");
    });

    it("старая вакансия с языком — на адрес, который разбирает бэкенд", () => {
        expect(legacyRedirect("/en/offers/host/857")).toBe("/offers/host/857");
        expect(legacyRedirect("/es/offers/host/1644")).toBe("/offers/host/1644");
    });

    it("страницы старого сайта, которые раньше переводил nginx старого SPA", () => {
        expect(legacyRedirect("/about")).toBe("/about-project");
        expect(legacyRedirect("/about-nko")).toBe("/npo");
        expect(legacyRedirect("/offers")).toBe("/offers-map");
        expect(legacyRedirect("/offers/")).toBe("/offers-map");
    });

    it("вакансия и статья по старому id — на бэкенд как есть", () => {
        expect(legacyBackendPath("/offers/host/857")).toBe("/offers/host/857");
        expect(legacyBackendPath("/blog/article/100")).toBe("/blog/article/100");
        expect(legacyBackendPath("/offers/857")).toBeNull();
        expect(legacyBackendPath("/blog/some-slug")).toBeNull();
        expect(legacyBackendPath("/offers/host/857/extra")).toBeNull();
    });

    it("остальное не трогает", () => {
        expect(legacyRedirect("/offers/5561")).toBeNull();
        expect(legacyRedirect("/offers/host/857")).toBeNull();
        expect(legacyRedirect("/de/offer-personal/1")).toBeNull();
        expect(legacyRedirect("/offer-personal/1/extra")).toBeNull();
        expect(legacyRedirect("/no-such-page")).toBeNull();
    });
});
