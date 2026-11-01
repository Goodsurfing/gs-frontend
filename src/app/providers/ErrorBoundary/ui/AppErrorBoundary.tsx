import * as Sentry from "@sentry/react";
import { Component, ErrorInfo, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import {
    isChunkLoadError,
    isReloadingForChunkError,
    reloadOnceForChunkError,
} from "@/shared/lib/handleChunkLoadError";

import styles from "./AppErrorBoundary.module.scss";

const ErrorFallback = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.wrapper} role="alert">
            <p className={styles.text}>{t("Что-то пошло не так")}</p>
            <button type="button" className={styles.button} onClick={() => window.location.reload()}>
                {t("Обновить страницу")}
            </button>
        </div>
    );
};

interface AppErrorBoundaryProps {
    children: ReactNode;
}

interface AppErrorBoundaryState {
    hasError: boolean;
}

/**
 * Без него ошибка рендера или незагрузившийся модуль страницы (React.lazy)
 * роняли всё дерево — пользователь видел белый экран. Модуль не загрузился
 * (старая вкладка после выкатки) — перезагружаем страницу один раз; прочие
 * ошибки — экран с кнопкой обновления и отправка в Bugsink.
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
    constructor(props: AppErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): AppErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Страница уже перезагружается за свежими файлами — ошибка lazy-импорта
        // после этого ожидаема (см. isReloadingForChunkError)
        if (isReloadingForChunkError()) {
            return;
        }
        if (isChunkLoadError(error) && reloadOnceForChunkError()) {
            return;
        }
        Sentry.captureException(error, {
            contexts: { react: { componentStack: info.componentStack ?? "" } },
        });
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;
        if (!hasError) {
            return children;
        }
        // Во время перезагрузки не мигаем экраном «Что-то пошло не так»
        return isReloadingForChunkError() ? null : <ErrorFallback />;
    }
}
