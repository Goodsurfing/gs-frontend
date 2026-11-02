"use client";

import { ErrorScreen } from "@/components/errors/ErrorScreen";

import "./globals.css";

/** Ошибка в корневом layout: своя разметка документа, иначе Next рисует стандартный экран */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
    return (
        <html lang="ru">
            <body>
                <ErrorScreen error={error} />
            </body>
        </html>
    );
}
