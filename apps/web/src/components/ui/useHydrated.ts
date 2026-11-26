import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

/**
 * false на сервере и во время гидратации, true — когда обработчики уже работают.
 * Формы входа/регистрации держат кнопку отправки выключенной до гидратации: иначе
 * браузер сам отправит форму (GET на ту же страницу) и всё введённое пропадёт (GS-335).
 */
export function useHydrated(): boolean {
    return useSyncExternalStore(noSubscribe, () => true, () => false);
}
