import { Fragment, type ReactNode } from "react";

/**
 * Текст из админки с разметкой **жирный** (как renderBoldText старого фронта):
 * HTML не поддерживается, только выделение жирным.
 */
export function boldText(text: string): ReactNode[] {
    return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((segment, index) => {
        const bold = segment.match(/^\*\*([^*]+)\*\*$/);
        return bold ? <strong key={index}>{bold[1]}</strong> : <Fragment key={index}>{segment}</Fragment>;
    });
}
