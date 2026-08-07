import React, { Fragment, ReactNode } from "react";

const BOLD_PATTERN = /(\*\*[^*]+\*\*)/g;
const BOLD_SEGMENT_PATTERN = /^\*\*([^*]+)\*\*$/;

/**
 * Админ-контент (например, миссия на /about-project) хранится как обычный
 * текст без HTML — простая **bold** разметка даёт возможность выделять
 * отдельные фразы жирным без полноценного WYSIWYG-редактора.
 */
export const renderBoldText = (text: string): ReactNode[] => text
    .split(BOLD_PATTERN)
    .filter(Boolean)
    .map((segment, index) => {
        const match = segment.match(BOLD_SEGMENT_PATTERN);
        if (match) {
            return <strong key={index}>{match[1]}</strong>;
        }
        return <Fragment key={index}>{segment}</Fragment>;
    });
