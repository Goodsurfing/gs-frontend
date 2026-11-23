"use client";

import { useEffect } from "react";

import { rememberReferral } from "@/lib/referral";

/** Запоминает код приглашения из адреса (?ref=…) — на любой странице сайта */
export function ReferralCapture() {
    useEffect(() => {
        rememberReferral(window.location.search);
    }, []);
    return null;
}
