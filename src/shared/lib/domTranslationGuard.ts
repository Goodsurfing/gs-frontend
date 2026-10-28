/**
 * Браузерные переводчики (Google Переводчик, перевод в Яндекс.Браузере)
 * заворачивают тексты страницы в свои <font>, и React потом пытается убрать
 * или вставить узел, которого на ожидаемом месте уже нет:
 * «Failed to execute 'removeChild' on 'Node'» — страница падает в белый экран.
 * На проде это GS-FRONTEND-8 на карточках вакансий.
 *
 * Известный обход (facebook/react#11538): если узел не наш ребёнок, не бросаем
 * исключение, а пропускаем операцию с предупреждением. В исходном виде такой
 * вызов всё равно бросил бы ошибку, так что поведение только безопаснее.
 */
let installed = false;

export const installDomTranslationGuard = (proto: Node = Node.prototype) => {
    if (installed && proto === Node.prototype) return;
    if (proto === Node.prototype) installed = true;

    const originalRemoveChild = proto.removeChild;
    // eslint-disable-next-line func-names
    proto.removeChild = function <T extends Node>(this: Node, child: T): T {
        if (child.parentNode !== this) {
            // eslint-disable-next-line no-console
            console.warn("removeChild: узел не является дочерним (вероятно, перевод страницы браузером)", child);
            return child;
        }
        return originalRemoveChild.call(this, child) as T;
    };

    const originalInsertBefore = proto.insertBefore;
    // eslint-disable-next-line func-names
    proto.insertBefore = function <T extends Node>(
        this: Node,
        newNode: T,
        referenceNode: Node | null,
    ): T {
        if (referenceNode && referenceNode.parentNode !== this) {
            // eslint-disable-next-line no-console
            console.warn("insertBefore: опорный узел не является дочерним (вероятно, перевод страницы браузером)", referenceNode);
            return newNode;
        }
        return originalInsertBefore.call(this, newNode, referenceNode) as T;
    };
};

/** Переведена ли страница браузером — для меток в Bugsink. */
export const isPageTranslatedByBrowser = (doc: Document = document): boolean => {
    const html = doc.documentElement;
    if (/translated-(ltr|rtl)/.test(html.className)) return true;
    // Сами мы <font> не рендерим — его вставляют переводчики.
    return Boolean(doc.getElementById("root")?.querySelector("font"));
};

/** Название браузера по user-agent — без версии и прочих деталей. */
export const browserFamily = (ua: string = navigator.userAgent): string => {
    if (/YaBrowser/i.test(ua)) return "yandex";
    if (/Edg\//i.test(ua)) return "edge";
    if (/OPR\//i.test(ua)) return "opera";
    if (/Firefox\//i.test(ua)) return "firefox";
    if (/Chrome\//i.test(ua)) return "chrome";
    if (/Safari\//i.test(ua)) return "safari";
    return "other";
};
