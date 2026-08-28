import {
    Map, ObjectManager, ZoomControl,
} from "@pbe/react-yandex-maps";
import cn from "classnames";
import React, {
    FC, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { GeolocationControl, YmapType } from "@/entities/Map";
import defaultImage from "@/shared/assets/images/default-offer-image.png";

import "./yandex-map-restyle-ballon.scss";
import { OfferMap } from "@/entities/Offer";
import styles from "./OffersMap.module.scss";
import Button from "@/shared/ui/Button/Button";
import IconComponent from "@/shared/ui/IconComponent/IconComponent";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Text } from "@/shared/ui/Text/Text";
import closeIcon from "@/shared/assets/icons/delete.svg";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";

const FOCUS_ZOOM = 10;
const BOUNDS_CHANGE_DEBOUNCE_MS = 400;
const MAP_LOAD_TIMEOUT_MS = 15_000;
// На сколько уровней зумить, если выбранная вакансия всё ещё смёржена в
// кластер (см. attemptOpenBalloon) — шаг, а не целевой зум, т.к. заранее
// неизвестно, сколько зума нужно конкретной паре/группе маркеров, чтобы
// разъехаться (gridSize у кластеризатора считается в экранных пикселях, не
// в метрах). Подбирается повторно на каждой попытке, пока не раскластерится
// или не упрёмся в MAP_OPTIONS.maxZoom.
const DECLUSTER_ZOOM_STEP = 2;

// Список вакансий кластера раньше рендерился в общем на всё приложение
// центрированном Modal (тёмная подложка на весь экран, карточка всегда по
// центру viewport) — визуально он вообще никак не был связан с картой:
// съезжал в угол экрана, а не к тому кластеру, по которому кликнули (живая
// жалоба пользователя со скриншотом). Ниже — свой позиционируемый попап
// с хвостиком, "приклеенный" к пиксельным координатам клика (см.
// handleClusterClick), а не centered-модалка поверх всего.
const CLUSTER_POPUP_WIDTH = 280;
const CLUSTER_POPUP_HALF_WIDTH = CLUSTER_POPUP_WIDTH / 2;
const CLUSTER_POPUP_EDGE_PADDING = 16;
// Отступ от точки клика до карточки — половина диаметра кластерной иконки
// (40px, см. .customClusterIcon) плюс сам хвостик, чтобы не перекрывать иконку.
const CLUSTER_POPUP_VERTICAL_GAP = 26;
// Примерная минимальная высота карточки — если над точкой клика меньше места,
// открываем попап вниз вместо вверх, чтобы не срезало верхним краем экрана.
const CLUSTER_POPUP_MIN_TOP_SPACE = 260;
// Насколько хвостик может отъехать от центра карточки при клэмпинге позиции
// по горизонтали у края карты — не даём ему вылезти на скруглённый угол.
const CLUSTER_POPUP_TAIL_MARGIN = 20;

// Модульные константы, а не инлайновые объекты в JSX — react-yandex-maps
// сравнивает props объекта ObjectManager (options/objects/clusters) ПО
// ССЫЛКЕ и на любое изменение зовёт .options.set() на реальном инстансе.
// Инлайновый литерал в JSX создаёт новую ссылку на КАЖДЫЙ рендер компонента
// (а он перерендеривается при каждом движении карты), из-за чего кластеры
// и маркеры на мгновение сбрасывались к дефолтному виду (белый кружок без
// цвета) и тут же перерисовывались обратно — то самое видимое моргание при
// любом движении карты, а не только при реальном изменении набора маркеров.
const OBJECT_MANAGER_OPTIONS = { clusterize: true, gridSize: 64 };
const OBJECT_MANAGER_OBJECTS = {
    openBalloonOnClick: true,
    // Яндекс.Карты по умолчанию скрывают иконку маркера, пока открыт его
    // balloon (hideIconOnBalloonOpen: true) — обычно незаметно, т.к. balloon
    // перекрывает то же место. Но при заходе по прямой ссылке на конкретную
    // вакансию balloon открывается программно сразу при загрузке карты, и
    // без этого флага маркер остаётся невидимым навсегда, пока пользователь
    // сам не закроет balloon вручную.
    hideIconOnBalloonOpen: false,
};
const MAP_OPTIONS = {
    suppressMapOpenBlock: true,
    restrictMapArea: [
        [83.23618, -178.9],
        [-73.87011, 181],
    ],
    maxZoom: 18,
    copyrightProvidersVisible: false,
    copyrightLogoVisible: false,
    copyrightUaVisible: false,
    yandexMapDisablePoiInteractivity: false,
    suppressObsoleteBrowserNotifier: false,
};
const ZOOM_CONTROL_OPTIONS = { position: { right: 10, top: 10 } };

export interface MapViewportBounds {
    boundsSwLat: number;
    boundsSwLng: number;
    boundsNeLat: number;
    boundsNeLng: number;
}

interface ClusterOfferItem {
    id: string;
    name: string;
    url: string;
    image: string;
    categoryName: string;
    categoryColor: string;
}

interface ClusterPopupState {
    offers: ClusterOfferItem[];
    // Географические координаты кластера — источник истины для позиции.
    // Клик по кластеру у Яндекс.Карт всегда чуть паннит карту (подводит
    // кластер ближе к центру), даже с clusterDisableClickZoom: true (тот
    // отключает только смену ЗУМА, не сам pan) — живая проверка на
    // стейдже. Пиксельная позиция клика устаревает уже к концу этого
    // pan'а; держим геокоординаты и пересчитываем экранную позицию заново
    // на каждый "actionend" (см. эффект ниже), а не одну статичную точку.
    left: number;
    top: number;
    tailOffset: number;
    placement: "top" | "bottom";
    coords: [number, number];
}

interface OffersMapProps {
    className?: string;
    classNameMap?: string;
    offersData: OfferMap[];
    isOffersLoading: boolean;
    selectedOfferId?: number;
    // undefined — нет выбора/ещё не знаем; объект — координаты для фокуса;
    // null — точно известно, что у вакансии нет координат (показать notice).
    // Намеренно НЕ выводится из offersData самой карты: после того как
    // маркеры стали viewport-scoped, отсутствие в offersData означает "вне
    // текущей видимой области", а не "нет координат вообще" — это два разных
    // случая, которые раньше смешивались.
    selectedOfferCoordinates?: { latitude: number; longitude: number } | null;
    onBoundsChange?: (bounds: MapViewportBounds) => void;
    isOffersError?: boolean;
    onRetry?: () => void;
}

export const OffersMap: FC<OffersMapProps> = memo((props: OffersMapProps) => {
    const {
        className, classNameMap, isOffersLoading,
        offersData, selectedOfferId, selectedOfferCoordinates, onBoundsChange,
        isOffersError, onRetry,
    } = props;
    const { locale } = useLocale();
    const { t } = useTranslation();
    const [ymapState, setYmapState] = useState<YmapType | undefined>(undefined);
    const [showNoLocationNotice, setShowNoLocationNotice] = useState(false);
    // Список вакансий кластера — целиком наш React-компонент, не нативный
    // balloon Яндекса. См. комментарий у clusterOpenBalloonOnClick ниже:
    // попытки стилизовать/сконфигурировать нативный кластерный balloon не
    // работали на практике, поэтому клик по кластеру обрабатывается вручную
    // и открывает это состояние вместо какого-либо Яндекс-layout.
    const [clusterPopup, setClusterPopup] = useState<ClusterPopupState | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const clusterPopupRef = useRef<HTMLDivElement | null>(null);
    // Скрипт Яндекс.Карт грузится извне (<script> тег, не React-дерево) —
    // если он падает или зависает (сеть, блокировщик, сбой самого сервиса),
    // это происходит ВНЕ цикла рендера React, и никакой Error Boundary (в
    // т.ч. встроенный в react-yandex-maps) это не поймает: onLoad просто
    // никогда не вызывается, карта молча остаётся пустым местом навсегда.
    // Тайм-аут — единственный надёжный способ вообще заметить эту ситуацию,
    // независимо от конкретной причины сбоя.
    const [mapLoadTimedOut, setMapLoadTimedOut] = useState(false);
    const mapRef = useRef<any>(null);
    const objectManagerRef = useRef<any>(null);
    const onBoundsChangeRef = useRef(onBoundsChange);
    onBoundsChangeRef.current = onBoundsChange;
    // isOffersLoading — это isLoading || isFetching у родителя, т.е. становится
    // true не только на самом первом заходе, но и на КАЖДОМ последующем
    // фоновом рефетче маркеров при bounds-change (после любого pan/zoom).
    // Сами маркеры уже переживают такой рефетч без моргания (см.
    // lastFeaturesRef ниже) — а вот оверлей-спиннер ниже раньше показывался
    // при каждом isOffersLoading===true без разбора, перекрывая всю карту
    // полупрозрачным белым (.loadingPlaceholder) на миг при любом движении.
    // Показываем его только пока карта не показала маркеры вообще ни разу.
    const hasLoadedOnceRef = useRef(false);
    if (!isOffersLoading) hasLoadedOnceRef.current = true;

    useEffect(() => {
        if (ymapState) return undefined;
        const timeoutId = setTimeout(() => setMapLoadTimedOut(true), MAP_LOAD_TIMEOUT_MS);
        return () => clearTimeout(timeoutId);
    }, [ymapState]);
    // Пока идёт bounds-рефетч, offersData на мгновение становится [] —
    // если сразу же чистить markers, ObjectManager размонтируется и
    // смонтируется заново при приходе новых данных, и карта один раз
    // моргает при каждом перемещении. Держим последний непустой набор
    // маркеров на экране, пока не придут новые (stale-while-revalidate).
    const lastFeaturesRef = useRef<any[]>([]);
    // ObjectManager (react-yandex-maps) на каждое изменение ССЫЛКИ features
    // делает remove(старые) + add(новые) по ВСЕЙ коллекции разом — не diff.
    // offersData после каждого bounds-рефетча приходит новым массивом от
    // RTK Query, даже если набор маркеров не изменился ни на йоту (например,
    // повторный fetch с теми же bounds или лёгкий pan в пределах того же
    // viewport) — .filter().map() ниже тогда всё равно строит новый массив
    // объектов, ObjectManager видит "новую" ссылку и на мгновение снимает и
    // возвращает ВСЕ маркеры сразу — заметное мигание карты. Держим сигнатуру
    // последнего построенного набора, чтобы при том же содержимом отдавать ту
    // же ссылку на features и не трогать ObjectManager вовсе.
    const lastFeaturesSignatureRef = useRef<string>("");
    // Сигнатура КАЖДОГО отдельного маркера (не всего набора разом) — нужна
    // ObjectManager-diff эффекту ниже, чтобы понять, какие именно маркеры
    // реально изменились между обновлениями, а какие можно оставить как есть.
    // Обычный Record, а не Map, — компонент Map из react-yandex-maps выше
    // затеняет глобальный конструктор Map в этом файле.
    const featureSignaturesRef = useRef<Record<string, string>>({});

    const noTitle = t("Без названия");
    const noCategory = t("Без категории");
    const offerWithoutName = t("Вакансия без названия");
    const learnMore = t("Подробнее");
    const vacancyListTitle = t("Список вакансий:");
    const noLocationText = t("У этой вакансии не указано местоположение на карте");
    const noOffersOnMapText = t("По вашему запросу вакансий на карте не найдено");
    const loadErrorTitle = t("Не удалось загрузить вакансии");
    const loadErrorSubtitle = t("Проверьте соединение и попробуйте ещё раз");
    const retryText = t("Попробовать снова");
    const mapLoadErrorTitle = t("Не удалось загрузить карту");
    const reloadPageText = t("Обновить страницу");

    const features = useMemo(() => {
        // Не путать "ещё грузится" с "загрузилось и оказалось пусто" — во втором
        // случае нужно реально очистить карту (и дать сработать пустому
        // уведомлению), а не бесконечно показывать маркеры предыдущего запроса.
        if (isOffersLoading) return lastFeaturesRef.current;

        const relevantOffers = offersData
            .filter((offer) => typeof offer.latitude === "number" && typeof offer.longitude === "number");

        const offerSignature = (offer: OfferMap) => [
            offer.id, offer.latitude, offer.longitude, offer.name,
            offer.categories[0]?.name ?? "", offer.categories[0]?.color ?? "",
            offer.image?.contentUrl ?? "",
        ].join(":");

        const signature = relevantOffers
            .map(offerSignature)
            .sort()
            .join("|")
            // templateLayoutFactory становится доступен только после onLoad
            // карты — если он ещё не готов на момент первого построения
            // features (offersData уже пришли раньше), iconContentLayout
            // маркера строится пустым (фабрики нет), и цветной кружок
            // маркера никогда не рисуется. Без этого флага в сигнатуре
            // переход "фабрика появилась" не отличался бы по содержимому от
            // предыдущего рендера и результат с пустым iconContentLayout
            // переиспользовался бы навсегда — маркер оставался бы невидимым
            // даже после того как balloon уже открывался поверх него.
            + (ymapState?.templateLayoutFactory ? "|ready" : "|pending");
        if (signature === lastFeaturesSignatureRef.current && lastFeaturesRef.current.length > 0) {
            return lastFeaturesRef.current;
        }
        lastFeaturesSignatureRef.current = signature;

        const newFeatureSignatures: Record<string, string> = {};
        const computed = relevantOffers
            .map((offer) => {
                newFeatureSignatures[offer.id.toString()] = offerSignature(offer);
                const imgSrc = offer?.image ?? undefined;
                const title = offer.name || noTitle;
                const categoryName = offer.categories[0]?.name ?? noCategory;
                const categoryColor = offer.categories[0]?.color ?? "var(--text-caption)";

                const offerUrl = getOfferPersonalPageUrl(locale, offer.id.toString());
                const balloonContent = `
          <div class="${styles.balloonWrapper}">
            <a href="${offerUrl}" class="${styles.balloonImageLink}">
              <img class="${styles.balloonImage}" src="${getMediaContent(imgSrc, "MEDIUM") ?? defaultImage}" />
            </a>
            <div class="${styles.text}">
              <div class="${styles.balloonTitle}">${title}</div>
              <div class="${styles.balloonCategory}" style="color: ${categoryColor};">${categoryName}</div>
              <a href="${offerUrl}" class="${styles.balloonLink}">${learnMore}</a>
            </div>
          </div>
        `;

                return {
                    type: "Feature",
                    id: offer.id.toString(),
                    geometry: { type: "Point", coordinates: [offer.latitude, offer.longitude] },
                    properties: {
                        name: offer.name ?? offerWithoutName,
                        balloonContent,
                        clusterCaption: offer.name ?? offerWithoutName,
                        hintContent: offer.name ?? offerWithoutName,
                        // Наш собственный кластер-попап (см. handleClusterClick
                        // ниже) читает эти три поля напрямую из
                        // geoObject.properties — раньше их тут не было вообще,
                        // а старый (нативный, недокументированный) шаблон
                        // кластера ссылался на несуществующий properties.url,
                        // из-за чего ссылки в списке вели на "undefined".
                        offerUrl,
                        offerImage: getMediaContent(imgSrc, "SMALL") ?? defaultImage,
                        categoryName,
                        categoryColor,
                    },
                    options: {
                        iconLayout: "default#imageWithContent",
                        // Второй ?. здесь обязателен: ymapState может быть truthy
                        // (onLoad уже сработал), но само templateLayoutFactory —
                        // ещё нет (см. комментарий у clusters ниже). Без него
                        // .createClass бросал бы TypeError прямо во время
                        // рендера, и всё дерево карты падало бы вместо того чтобы
                        // просто временно остаться без цветной иконки до
                        // следующего пересчёта (см. |ready"/"|pending" в
                        // сигнатуре ниже).
                        iconContentLayout: ymapState?.templateLayoutFactory?.createClass(
                            `<div style="background-color: ${categoryColor || "var(--accent-color)"};" class="${styles.customPlacemarkIcon}"></div>`,
                        ),
                        // Без iconContentSize Яндекс.Карты по умолчанию заводят под
                        // content крошечный 10x10 контейнер (наш div визуально
                        // растягивался до 30x30 через CSS, перекрывая границы) —
                        // из-за этого видимый кружок и реальная кликабельная
                        // область (iconShape) расходились на добрый десяток
                        // пикселей, клик по видимому маркеру мимо своей же
                        // hit-зоны молча ничего не делал. iconContentOffset НЕ
                        // трогаем (оставляем дефолт [0,0]): контейнер content уже
                        // сам сидит внутри контейнера image, который и так
                        // сдвинут на iconImageOffset — если продублировать тот же
                        // сдвиг ещё и для content, смещение применится дважды.
                        iconContentSize: [30, 30],
                        iconImageSize: [30, 30],
                        iconImageOffset: [-15, -15],
                        // Без iconShape Яндекс.Карты по умолчанию считают форму
                        // маркера прямоугольным пином, а не нашим кастомным
                        // кружком — из-за этого хвостик balloon указывал не в
                        // центр маркера. Координаты iconShape отсчитываются от
                        // самой точки геопривязки (anchor), а НЕ от рамки
                        // iconImageOffset — [15, 15] сдвигал бы кликабельный круг
                        // на 15px вправо-вниз от видимого центра маркера
                        // (visual center = anchor, т.к. iconImageOffset уже
                        // центрирует картинку на anchor). Подтверждено вживую:
                        // курсор "pointer" появлялся в точке anchor+(15,15), а не
                        // на самом видимом маркере. [0, 0] — центр круга ровно в
                        // anchor.
                        iconShape: {
                            type: "Circle",
                            coordinates: [0, 0],
                            radius: 15,
                        },
                    },
                };
            });

        featureSignaturesRef.current = newFeatureSignatures;
        lastFeaturesRef.current = computed;
        return computed;
    }, [
        isOffersLoading, offersData, locale, ymapState?.templateLayoutFactory,
        noTitle, noCategory, offerWithoutName, learnMore,
    ]);

    // ObjectManager (react-yandex-maps) на каждое изменение ССЫЛКИ на features
    // делает remove(ВСЕ старые) + add(ВСЕ новые) — не diff. На десктопе это
    // почти незаметно, но на мобильном viewport геометрически покрывает
    // заметно меньшую площадь при том же пикселе pan'а — почти любое
    // перетаскивание меняет хотя бы один маркер, и вся карта на мгновение
    // мигает пустой, даже если 9 из 10 маркеров не изменились. Держим
    // ObjectManager напрямую через нативные add()/remove() и передаём ему в
    // features стабильную (никогда не меняющуюся) пустую ссылку — тогда
    // декларативная remove+add ветка самой обёртки не срабатывает вовсе, а
    // добавляем/удаляем только те маркеры, что реально изменились.
    const mountedFeaturesRef = useRef<Record<string, any>>({});
    const mountedSignaturesRef = useRef<Record<string, string>>({});
    const objectManagerFeaturesSeedRef = useRef<any[]>([]);

    // Триггерим пересчёт эффекта ниже не только при смене features, но и
    // при (пере)монтировании самого ObjectManager: ymapState появляется
    // асинхронно (эффект внутри <Map>), поэтому <ObjectManager> нередко
    // монтируется ПОЗЖЕ первого рендера, на котором features уже посчитан
    // и получил тот же самый (мемоизированный) объект — без этого тика
    // эффект ниже не перезапустился бы и свежесмонтированный ObjectManager
    // остался бы без единого маркера.
    const [objectManagerMountTick, setObjectManagerMountTick] = useState(0);

    const setObjectManagerRef = useCallback((instance: any) => {
        objectManagerRef.current = instance;
        if (instance) {
            mountedFeaturesRef.current = {};
            mountedSignaturesRef.current = {};
            setObjectManagerMountTick((tick) => tick + 1);
        }
    }, []);

    useLayoutEffect(() => {
        const objectManager = objectManagerRef.current;
        if (!objectManager) return;

        const nextSignatures = featureSignaturesRef.current;
        const prevFeatures = mountedFeaturesRef.current;
        const prevSignatures = mountedSignaturesRef.current;

        const toRemove: any[] = [];
        const toAdd: any[] = [];

        Object.entries(prevFeatures).forEach(([id, feature]) => {
            if (!(id in nextSignatures)) toRemove.push(feature);
        });

        features.forEach((feature) => {
            const prevSignature = prevSignatures[feature.id];
            if (prevSignature === undefined) {
                toAdd.push(feature);
            } else if (prevSignature !== nextSignatures[feature.id]) {
                toRemove.push(prevFeatures[feature.id]);
                toAdd.push(feature);
            }
        });

        if (toRemove.length) objectManager.remove(toRemove);
        if (toAdd.length) objectManager.add(toAdd);

        mountedFeaturesRef.current = Object.fromEntries(
            features.map((feature) => [feature.id, feature]),
        );
        mountedSignaturesRef.current = { ...nextSignatures };
    }, [features, objectManagerMountTick]);

    // Оффер, для которого нужно открыть balloon, как только его маркер
    // реально появится в ObjectManager. null — нечего открывать / уже открыли.
    const pendingBalloonOfferIdRef = useRef<number | null>(null);
    // true — pan уже завершился (actionend), можно пробовать открыть balloon
    // реактивно при каждом обновлении маркеров. Без этого флага реактивный
    // эффект ниже (на features) стрелял бы balloon.open ещё ДО того, как
    // карта закончит панорамирование — балун появлялся бы мгновенно вместо
    // "сначала фокус, потом табличка".
    const panActionEndedRef = useRef(false);

    // Пытается открыть balloon прямо сейчас. Возвращает true, если маркер уже
    // зарегистрирован в ObjectManager и open() не бросил — таймер-цикл ниже
    // на этом остановится. false — маркера пока нет, надо ждать/повторить.
    //
    // allowDeclusterZoom — можно ли в процессе САМОСТОЯТЕЛЬНО зумить карту,
    // чтобы раскластеризовать маркер (см. ветку isClustered ниже). true —
    // только для retry-цикла tryOpenBalloon ниже, который живёт ограниченное
    // время (до 30 попыток) сразу после САМОГО выбора вакансии — это его
    // законная задача, "довести" карту до состояния, где маркер виден.
    // false — для реактивного эффекта на features (см. ниже): тот эффект
    // живёт НЕОГРАНИЧЕННО долго, пока выбрана та же вакансия, и реагирует
    // на ЛЮБОЕ следующее обновление маркеров — включая те, что пользователь
    // вызвал сам явным зумом/паном спустя долгое время после того, как
    // balloon уже показывался. Живая проверка: выбрал вакансию → вручную
    // отзумил карту так, что маркер смёржился в кластер → карта тут же САМА
    // приближала зум обратно, отменяя действие пользователя, потому что
    // pendingBalloonOfferIdRef всё ещё указывал на ту же вакансию и эффект
    // на features раз за разом пытался её раскластеризовать — пользователь
    // жал "минус", а карта сама жала "плюс" в ответ.
    const attemptOpenBalloon = (offerId: number, allowDeclusterZoom: boolean = true): boolean => {
        const objectManager = objectManagerRef.current;
        if (!objectManager) return false;
        // Даже после actionend объект может ещё не попасть в ObjectManager:
        // маркеры viewport-scoped (см. features выше) и приходят отдельным
        // bounds-запросом с 400мс дебаунсом ПОСЛЕ actionend, так что клик по
        // вакансии в списке почти всегда обгоняет собственный набор маркеров
        // под новые bounds. Проверяем через getById, что объект уже
        // зарегистрирован, ПЕРЕД тем как звать balloon.open — раньше звали
        // open() вслепую и полагались на то, что она либо синхронно бросит
        // TypeError ("Cannot read properties of null (reading 'geometry')")
        // для отсутствующего объекта, либо успешно откроет balloon. На деле
        // для отсутствующего объекта open() иногда просто молча возвращает
        // falsy без throw — тогда старый код принимал это за успех и больше
        // не повторял попытку, табличка так и не появлялась. getById даёт
        // однозначный ответ вместо гадания по побочному эффекту open().
        if (!objectManager.objects.getById(offerId.toString())) return false;
        // Объект зарегистрирован, но может всё ещё визуально быть смёржен в
        // кластер (например, ссылка с ?offerId= на вакансию, у которой рядом
        // есть соседи, — FOCUS_ZOOM сам по себе не гарантирует расклайстеринг
        // именно этой пары/группы, т.к. gridSize кластеризатора считается в
        // экранных пикселях, а не в метрах). open() в этом случае технически
        // срабатывает, но balloon повисает над безликим кружком-кластером
        // ("2" и т.п.) вместо своего реального маркера — выглядит как баг.
        // Дозумируемся и ждём следующей попытки вместо того чтобы открывать
        // balloon в таком виде.
        if (objectManager.getObjectState(offerId.toString())?.isClustered) {
            const map = mapRef.current;
            const currentZoom = map?.getZoom();
            if (allowDeclusterZoom && map && typeof currentZoom === "number" && currentZoom < MAP_OPTIONS.maxZoom) {
                map.setZoom(
                    Math.min(currentZoom + DECLUSTER_ZOOM_STEP, MAP_OPTIONS.maxZoom),
                    { duration: 400, checkZoomRange: true },
                );
            }
            return false;
        }
        // Пятое живое наблюдение на стейдже: getById может подтвердить, что
        // объект уже числится в коллекции, ДО того как его геометрия/DOM
        // реально готовы для показа balloon — open() в этот момент всё ещё
        // может синхронно бросить. Раньше пойманное исключение здесь тихо
        // считалось "успехом" (pendingBalloonOfferIdRef обнулялся, дальше
        // никто не повторял) — табличка так и не появлялась, хотя маркер по
        // прямому клику уже прекрасно открывался. Теперь бросок = "ещё не
        // готово", возвращаем false, чтобы вызывающий код запланировал
        // повтор — так же, как и при отсутствии объекта.
        try {
            objectManager.objects.balloon.open(offerId.toString())?.catch(() => {});
        } catch {
            return false;
        }
        // Открытие balloon отдельного маркера само по себе не закрывает наш
        // React-попап со списком вакансий кластера, если тот уже был открыт
        // раньше (пользователь только что кликнул по кластеру, увидел
        // список, а потом сработал этот код) — обе таблички повисали бы на
        // экране одновременно, одна поверх другой.
        setClusterPopup(null);
        // Шестое живое наблюдение на стейдже: даже успешный open() не значит
        // "готово навсегда". Bounds-дебаунс может дать ДВЕ волны обновления
        // маркеров за один pan (промежуточная позиция во время анимации +
        // финальная после actionend) — второй remove()+add() в ObjectManager
        // молча закрывает уже открытый balloon. Раньше pendingBalloonOfferIdRef
        // обнулялся сразу по первому успеху, и реактивный эффект переставал
        // реагировать на дальнейшие обновления features — balloon закрывался
        // и больше никогда не переоткрывался, хотя код считал задачу
        // выполненной. НЕ обнуляем pending здесь: пока выбрана та же вакансия,
        // каждое следующее обновление маркеров просто попробует открыть
        // balloon ещё раз (дёшево и идемпотентно, если он и так уже открыт).
        // pending сбрасывается только когда меняется сам выбор (см. эффект
        // ниже) — реального смысла "мы наконец закончили" здесь больше нет.
        return true;
    };

    useEffect(() => {
        // Скрываем уведомление сразу при любой смене выбора/пересчёте
        // координат — его текст относится к КОНКРЕТНОЙ вакансии, нельзя
        // оставлять его от предыдущего выбора, пока решается, что показать
        // для нового.
        setShowNoLocationNotice(false);

        if (!selectedOfferId || selectedOfferCoordinates === undefined) {
            pendingBalloonOfferIdRef.current = null;
            panActionEndedRef.current = false;
            return undefined;
        }

        // Часть вакансий физически не имеет координат в базе (адрес не
        // геокодирован) — карте попросту нечем "сфокусироваться". Раньше
        // клик по такой карточке в списке просто ничего не делал молча,
        // что выглядело как баг; показываем явную причину вместо тишины.
        if (selectedOfferCoordinates === null) {
            pendingBalloonOfferIdRef.current = null;
            panActionEndedRef.current = false;
            // Небольшая задержка перед показом: при переключении между
            // элементами списка selectedOfferCoordinates пересчитывается
            // синхронно и почти всегда сразу верный, но родитель (см.
            // fetchPageOffersLocation в OffersSearchFilter.tsx) на КАЖДЫЙ
            // выбор заново запускает фоновый рефетч координат страницы —
            // без задержки здесь уведомление успело бы мигнуть, если этот
            // рефетч на миг отдаст устаревший/пустой результат раньше, чем
            // подтвердит реальные координаты. Если у вакансии действительно
            // нет координат, задержка не страшна — null никуда не денется,
            // и уведомление просто появится чуть позже.
            const timeoutId = setTimeout(() => setShowNoLocationNotice(true), 350);
            return () => clearTimeout(timeoutId);
        }

        if (!mapRef.current) return undefined;

        const currentZoom = mapRef.current.getZoom();
        mapRef.current.setCenter(
            [selectedOfferCoordinates.latitude, selectedOfferCoordinates.longitude],
            Math.max(currentZoom, FOCUS_ZOOM),
            { duration: 400 },
        );

        // Клик по карточке в списке раньше молча подвигал карту, а подсказку
        // с превью вакансии видел только тот, кто кликнул прямо по маркеру.
        // Открываем тот же balloon программно, но только после того как pan
        // завершится (actionend) — иначе ObjectManager может не найти
        // объект, если он ещё не попал в текущий кластер на новом месте.
        const map = mapRef.current;
        pendingBalloonOfferIdRef.current = selectedOfferId;
        panActionEndedRef.current = false;

        let retryTimeoutId: ReturnType<typeof setTimeout> | undefined;
        let cancelled = false;

        const tryOpenBalloon = (attemptsLeft: number) => {
            if (cancelled) return;
            if (attemptOpenBalloon(selectedOfferId)) return;
            if (attemptsLeft <= 0) return;
            retryTimeoutId = setTimeout(() => tryOpenBalloon(attemptsLeft - 1), 300);
        };

        const openBalloon = () => {
            map.events.remove("actionend", openBalloon);
            panActionEndedRef.current = true;
            // Таймер-ретраи — подстраховка на случай если реактивный триггер
            // ниже (эффект на features) почему-то не сработает. Основной путь
            // быстрее: как только придут новые маркеры под bounds, тот эффект
            // сразу попробует открыть balloon, не дожидаясь следующего тика
            // таймера. 30 попыток по 300мс (9с) — щедрый запас поверх 400мс
            // bounds-дебаунса на случай медленной сети.
            tryOpenBalloon(30);
        };
        map.events.add("actionend", openBalloon);
        return () => {
            cancelled = true;
            if (retryTimeoutId) clearTimeout(retryTimeoutId);
            map.events.remove("actionend", openBalloon);
        };
        // ymapState в зависимостях намеренно: ObjectManager монтируется
        // (и заполняет objectManagerRef) только после onLoad карты, который
        // может случиться позже, чем этот эффект уже отработал на первом
        // рендере с уже выбранной вакансией (например, ?offerId= в URL).
    }, [selectedOfferId, selectedOfferCoordinates, ymapState]);

    // Реактивный триггер: как только приходят новые (bounds-scoped) маркеры,
    // сразу пробуем открыть balloon для отложенной вакансии — не дожидаясь
    // следующего тика таймера выше. Раньше единственным путём был опрос по
    // таймеру (300мс), и на медленной сети/бэкенде реальный round-trip до
    // vacancy/for-map/list мог не уложиться в весь отведённый бюджет —
    // табличка молча не появлялась, хотя маркер уже был на карте.
    //
    // allowDeclusterZoom: false — этот эффект живёт неограниченно долго,
    // пока выбрана та же вакансия (см. комментарий у attemptOpenBalloon), и
    // не должен САМ зумить карту в ответ на действия пользователя,
    // случившиеся спустя долгое время после исходного выбора — тем этим
    // занимается только ограниченный по попыткам retry-цикл выше.
    useEffect(() => {
        // panActionEndedRef: не пытаться открыть balloon раньше, чем
        // закончится сам pan — иначе табличка выскакивала бы мгновенно при
        // клике, до того как карта успевала визуально долететь до маркера.
        if (panActionEndedRef.current && pendingBalloonOfferIdRef.current !== null) {
            attemptOpenBalloon(pendingBalloonOfferIdRef.current, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [features]);

    // Клик прямо по маркеру на карте открывает его balloon через нативный
    // openBalloonOnClick у ObjectManager — это происходит целиком внутри
    // Яндекс.Карт, никак не проходя через selectedOfferId/pendingBalloonOfferIdRef
    // выше. Без синхронизации ниже pendingBalloonOfferIdRef так и остаётся
    // указывать на СТАРЫЙ выбор (например, из списка) — и следующий же
    // bounds-рефетч маркеров (любой pan/zoom) реактивным триггером выше
    // молча переоткрывает balloon старого маркера, отбирая его у того,
    // что пользователь только что открыл прямым кликом. Слушаем balloonopen
    // на самой коллекции objects (а не на отдельных фичах) — событие
    // одинаково стреляет и от нативного клика, и от нашего собственного
    // attemptOpenBalloon(), так что pendingBalloonOfferIdRef всегда отражает
    // ДЕЙСТВИТЕЛЬНО открытый сейчас balloon, кто бы его ни открыл.
    useEffect(() => {
        const objectManager = objectManagerRef.current;
        if (!objectManager) return undefined;

        const handleBalloonOpen = (e: any) => {
            const objectId = Number(e.get("objectId"));
            if (!Number.isNaN(objectId)) {
                pendingBalloonOfferIdRef.current = objectId;
                panActionEndedRef.current = true;
            }
        };

        objectManager.objects.events.add("balloonopen", handleBalloonOpen);
        return () => {
            objectManager.objects.events.remove("balloonopen", handleBalloonOpen);
        };
    }, [objectManagerMountTick]);

    // Экранная позиция попапа кластера строится из его ГЕОГРАФИЧЕСКИХ
    // координат заново при каждом вызове — не запоминает пиксели одного
    // конкретного момента. geo -> глобальные пиксели (через текущую
    // проекцию карты и зум) -> пиксели страницы (map.converter) -> пиксели
    // относительно wrapperRef. null — карта/wrapperRef ещё не готовы
    // (например, projection недоступен на первом рендере).
    const computeClusterPopupAnchor = (coords: [number, number]): {
        left: number; top: number; tailOffset: number; placement: "top" | "bottom";
    } | null => {
        const map = mapRef.current;
        const wrapperRect = wrapperRef.current?.getBoundingClientRect();
        if (!map || !wrapperRect) return null;

        let anchorX: number;
        let anchorY: number;
        try {
            const projection = map.options.get("projection");
            const globalPixels = projection.toGlobalPixels(coords, map.getZoom());
            const [pageX, pageY] = map.converter.globalToPage(globalPixels);
            anchorX = pageX - (wrapperRect.left + window.scrollX);
            anchorY = pageY - (wrapperRect.top + window.scrollY);
        } catch {
            return null;
        }

        const minX = CLUSTER_POPUP_HALF_WIDTH + CLUSTER_POPUP_EDGE_PADDING;
        const maxAvailableX = wrapperRect.width
            - CLUSTER_POPUP_HALF_WIDTH - CLUSTER_POPUP_EDGE_PADDING;
        const maxX = Math.max(minX, maxAvailableX);
        const clampedX = Math.min(Math.max(anchorX, minX), maxX);
        const tailOffset = Math.min(
            Math.max(anchorX - clampedX, -CLUSTER_POPUP_TAIL_MARGIN),
            CLUSTER_POPUP_TAIL_MARGIN,
        );

        const placement: "top" | "bottom" = anchorY < CLUSTER_POPUP_MIN_TOP_SPACE ? "bottom" : "top";
        const top = placement === "top"
            ? anchorY - CLUSTER_POPUP_VERTICAL_GAP
            : anchorY + CLUSTER_POPUP_VERTICAL_GAP;

        return {
            left: clampedX, top, tailOffset, placement,
        };
    };

    // Пересчитывает позицию уже открытого попапа кластера на каждый
    // "actionend" — сам клик по кластеру уже панит карту (см. коммент у
    // ClusterPopupState), плюс пользователь может двигать карту дальше,
    // пока попап открыт. Держим его буквально приклеенным к геоточке
    // кластера, а не закрываем при первом же движении карты — тот самый
    // "чтобы это было всё же на карте", а не одноразовая табличка, которая
    // тут же пропадает от собственного pan'а клика её открывшего.
    useEffect(() => {
        if (!clusterPopup || !mapRef.current) return undefined;
        const map = mapRef.current;
        const reposition = () => {
            setClusterPopup((prev) => {
                if (!prev) return prev;
                const anchor = computeClusterPopupAnchor(prev.coords);
                return anchor ? { ...prev, ...anchor } : prev;
            });
        };
        map.events.add("actionend", reposition);
        return () => map.events.remove("actionend", reposition);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [!!clusterPopup]);

    // Симметричный случай: клик по кластеру должен показать список вакансий
    // внутри него. Обрабатываем клик вручную вместо нативного balloon
    // Яндекса (clusterOpenBalloonOnClick: false у clusters выше) — читаем
    // geoObjects прямо из кликнутого кластера и открываем наш попап.
    // properties.offerUrl/offerImage/categoryName/categoryColor — то, что мы
    // сами положили в properties каждого маркера при построении features.
    // Заодно закрываем balloon отдельного маркера и сбрасываем отложенный
    // выбор — раз пользователь сейчас смотрит на кластер, не нужно, чтобы
    // следующий bounds-рефетч молча переоткрыл старую табличку поверх того,
    // что он видит.
    useEffect(() => {
        const objectManager = objectManagerRef.current;
        if (!objectManager) return undefined;

        const handleClusterClick = (e: any) => {
            const objectId = e.get("objectId");
            const clusterObject = objectManager.clusters.getById(objectId);
            const geoObjects = clusterObject?.properties?.geoObjects ?? [];
            const items: ClusterOfferItem[] = geoObjects.map((geoObject: any) => ({
                id: String(geoObject.id),
                name: geoObject.properties.name,
                url: geoObject.properties.offerUrl,
                image: geoObject.properties.offerImage,
                categoryName: geoObject.properties.categoryName,
                categoryColor: geoObject.properties.categoryColor,
            }));

            // ObjectManager отдаёт geometry кластера как ПЛОСКИЕ GeoJSON-данные
            // ({ type: "Point", coordinates: [...] }) — не обёрнутый
            // ymaps.IGeometry с методом .getCoordinates(), в отличие от
            // geometry обычных GeoObject. Живая проверка: вызов
            // .getCoordinates?.() на этом объекте всегда молча возвращает
            // undefined (метода просто нет), из-за чего coords здесь
            // раньше был неизменно null.
            const coords: [number, number] | null = clusterObject?.geometry?.coordinates ?? null;
            const anchor = coords && computeClusterPopupAnchor(coords);

            if (coords && anchor) {
                setClusterPopup({ offers: items, coords, ...anchor });
            } else if (coords) {
                // Карта/wrapperRef ещё не готовы разово посчитать пиксели
                // (например, самый первый рендер) — покажем по центру,
                // эффект на actionend ниже поправит позицию при первой же
                // возможности.
                setClusterPopup({
                    offers: items, coords, left: 0, top: 0, tailOffset: 0, placement: "top",
                });
            }

            pendingBalloonOfferIdRef.current = null;
            try {
                objectManager.objects.balloon.close();
            } catch {
                // no-op: balloon отдельного маркера мог и не быть открыт
            }
        };

        objectManager.clusters.events.add("click", handleClusterClick);
        return () => {
            objectManager.clusters.events.remove("click", handleClusterClick);
        };
    }, [objectManagerMountTick]);

    // Клик/тап вне попапа и вне самой карты, или Escape, закрывают его —
    // тот же UX, что был у старого Modal (клик по подложке закрывал
    // карточку), но без самой подложки: карта под попапом остаётся видимой
    // и кликабельной везде, кроме самой карточки.
    //
    // "Вне самой карты" — намеренно, а не только "вне попапа": иначе
    // mousedown в начале drag'а карты (drag тоже стартует с mousedown,
    // и стартует он ВНЕ попапа, поскольку попап — не карта) рвал бы попап в
    // первую же миллисекунду перетаскивания, даже не дав карте сдвинуться,
    // хотя ровно для этого случая (пользователь двигает карту дальше, пока
    // попап открыт) и существует repositioning-эффект выше. Клик по ДРУГОМУ
    // кластеру/маркеру на карте всё равно откроет свой balloon/попап через
    // собственные обработчики ниже независимо от этой проверки — она нужна
    // только чтобы не закрывать попап на mousedown, который старта drag'а
    // или клика по пустому месту карты. Живая проверка: старая версия (клик
    // где угодно вне попапа) рвала попап сразу при начале любого drag'а.
    useEffect(() => {
        if (!clusterPopup) return undefined;
        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (clusterPopupRef.current?.contains(target)) return;
            if (wrapperRef.current?.contains(target)) return;
            setClusterPopup(null);
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setClusterPopup(null);
        };
        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [!!clusterPopup]);

    useEffect(() => {
        if (!ymapState || !mapRef.current) return undefined;

        const map = mapRef.current;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const emitBounds = () => {
            const bounds = map.getBounds?.();
            if (!bounds) return;
            const [[swLat, swLng], [neLat, neLng]] = bounds;
            // На мобильном эта же карта продолжает существовать в DOM, просто
            // скрыта через display:none (десктопная раскладка в
            // OffersSearchFilter.tsx) — Яндекс.Карты в нулевом контейнере
            // отдают вырожденный bounds, где SW и NE совпадают. Реальный pan/
            // zoom так не бывает; без этой проверки такой bounds улетает
            // наверх, там уходит в vacancy/for-map/list и стирает реальный
            // набор маркеров пустым ответом — в том числе у видимой мобильной
            // карты, которая делит один и тот же allOffersMap со скрытой.
            if (swLat === neLat && swLng === neLng) return;
            onBoundsChangeRef.current?.({
                boundsSwLat: swLat, boundsSwLng: swLng, boundsNeLat: neLat, boundsNeLng: neLng,
            });
        };

        const handleBoundsChange = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(emitBounds, BOUNDS_CHANGE_DEBOUNCE_MS);
        };

        map.events.add("boundschange", handleBoundsChange);
        emitBounds();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            map.events.remove("boundschange", handleBoundsChange);
        };
    }, [ymapState]);

    // Пустая карта (0 маркеров) отличается от карты, которая ещё грузится
    // или упала с ошибкой — без этого условия пользователь видел бы то же
    // самое молчаливое пустое место в обоих случаях.
    const isEmptyResult = !isOffersError && !isOffersLoading
        && !!ymapState && features.length === 0;
    const [showEmptyNotice, setShowEmptyNotice] = useState(false);

    useEffect(() => {
        if (!isEmptyResult) {
            setShowEmptyNotice(false);
            return undefined;
        }
        // Дебаунс, а не мгновенный показ: bounds-дебаунс может дать ДВЕ волны
        // обновления маркеров за один pan/zoom (см. тот же комментарий у
        // openBalloon выше) — промежуточная волна иногда на миг отдаёт пустой
        // результат (например, пан через область карты без вакансий), прежде
        // чем финальная волна приносит реальный набор маркеров под итоговые
        // bounds. Без задержки здесь уведомление "не найдено" успевало бы
        // мигнуть между этими волнами, даже когда вакансии на самом деле есть.
        const timeoutId = setTimeout(() => setShowEmptyNotice(true), BOUNDS_CHANGE_DEBOUNCE_MS);
        return () => clearTimeout(timeoutId);
    }, [isEmptyResult]);

    // См. комментарий у OBJECT_MANAGER_OPTIONS/OBJECT_MANAGER_OBJECTS выше —
    // тот же принцип: без useMemo этот объект (и вложенные createClass())
    // пересоздавался бы на каждый рендер, и клaстеры мигали бы дефолтной
    // иконкой при любом движении карты, даже если реально ничего не менялось.
    // Намеренно НЕ участвует в условии монтирования ObjectManager ниже (по
    // аналогии с GS-112: templateLayoutFactory иногда ещё не готов к моменту
    // onLoad) — если бы монтирование зависело от truthy clusters, и
    // templateLayoutFactory оказался бы не готов именно на этом рендере,
    // ObjectManager мог бы навсегда остаться немонтированным: ymapState как
    // ссылка на объект после onLoad больше не меняется, и без дальнейших
    // ре-рендеров (например, если пользователь просто открыл карту по прямой
    // ссылке и не трогал её) переоценить условие было бы просто нечем —
    // маркер и balloon молча пропадали бы навсегда, без единой ошибки.
    const clusters = useMemo(() => (ymapState?.templateLayoutFactory ? {
        iconLayout: "default#imageWithContent",
        clusterIconLayout: ymapState.templateLayoutFactory.createClass(
            `<div class="${styles.customClusterIcon}">
                {{ properties.geoObjects.length }}
            </div>`,
        ),
        clusterIconShape: {
            type: "Circle",
            coordinates: [20, 20],
            radius: 20,
        },
        clusterIconSize: [40, 40],
        clusterIconOffset: [-20, -20],
        // Ни clusterBalloonContentLayout (наш шаблон), ни
        // clusterBalloonPanelMaxMapArea: 0 не помогли — Яндекс всё равно
        // где-то уходил в свой нативный двухпанельный layout ("b-cluster-
        // tabs": список слева без подложки + превью выбранного элемента
        // справа), поверх которого наши стили не применялись — тот самый
        // нечитаемый текст прямо на тайлах карты, который поймал
        // пользователь на скриншоте. Это версии/сборки-специфичное
        // поведение самого Яндекса, а не что-то, что можно надёжно
        // задавить конфигом снаружи. clusterOpenBalloonOnClick: false
        // отключает нативный balloon для кластеров целиком — вместо него
        // клик обрабатывается вручную (см. handleClusterClick ниже),
        // который открывает наш собственный попап, приклеенный к карте.
        clusterOpenBalloonOnClick: false,
        // Без этого клик по кластеру ловит только встроенный zoom-in
        // Яндекса — он поглощает событие раньше, чем до него доходит наш
        // clusters.events.add("click", ...) ниже, и попап никогда не
        // открывается (обнаружено живой проверкой на стейдже: клик всегда
        // просто зумил карту).
        clusterDisableClickZoom: true,
    } : undefined), [ymapState?.templateLayoutFactory]);

    return (
        <div className={cn(className, styles.wrapper)} ref={wrapperRef}>
            {mapLoadTimedOut && (
                <div className={styles.mapErrorOverlay}>
                    <Text textSize="primary" text={mapLoadErrorTitle} />
                    <Button
                        color="BLUE"
                        size="MEDIUM"
                        variant="OUTLINE"
                        onClick={() => window.location.reload()}
                    >
                        {reloadPageText}
                    </Button>
                </div>
            )}
            {!mapLoadTimedOut && isOffersError && (
                <div className={styles.loadingPlaceholder}>
                    <div className={styles.errorContent}>
                        <Text textSize="primary" text={loadErrorTitle} />
                        <Text textSize="secondary" text={loadErrorSubtitle} />
                        {onRetry && (
                            <Button
                                color="BLUE"
                                size="MEDIUM"
                                variant="OUTLINE"
                                onClick={onRetry}
                            >
                                {retryText}
                            </Button>
                        )}
                    </div>
                </div>
            )}
            {!mapLoadTimedOut && isOffersLoading && !hasLoadedOnceRef.current && (
                <div className={styles.loadingPlaceholder}>
                    <MiniLoader />
                </div>
            )}
            {showEmptyNotice && (
                <div className={styles.noLocationNotice}>{noOffersOnMapText}</div>
            )}
            {showNoLocationNotice && (
                <div className={styles.noLocationNotice}>{noLocationText}</div>
            )}
            {!mapLoadTimedOut && ymapState && <GeolocationControl mapInstance={mapRef.current} />}
            <Map
                defaultState={{
                    center: [50, 50], zoom: 2.05, controls: [],
                }}
                width="100%"
                height="100%"
                instanceRef={mapRef}
                options={MAP_OPTIONS}
                onLoad={(ymap) => {
                    setYmapState(ymap);
                }}
                // react-yandex-maps сам оборачивает Map в Error Boundary —
                // без onError падение внутри неё (например, сбой самого
                // Яндекс.Карт SDK при рендере) тихо съедалось бы этим
                // boundary, и карта осталась бы пустым местом без единого
                // сигнала. Переиспользуем тот же оверлей, что и для
                // тайм-аута загрузки — с точки зрения пользователя это
                // один и тот же "карта не работает".
                onError={() => setMapLoadTimedOut(true)}
                className={cn(styles.map, classNameMap)}
            >
                <ZoomControl options={ZOOM_CONTROL_OPTIONS} />
                {(ymapState && (features.length > 0)) && (
                    <ObjectManager
                        instanceRef={setObjectManagerRef}
                        features={objectManagerFeaturesSeedRef.current}
                        options={OBJECT_MANAGER_OPTIONS}
                        objects={OBJECT_MANAGER_OBJECTS}
                        clusters={clusters}
                    />
                )}
            </Map>
            {clusterPopup && (
                <div
                    ref={clusterPopupRef}
                    className={styles.clusterPopup}
                    style={{
                        left: clusterPopup.left,
                        top: clusterPopup.top,
                        transform: clusterPopup.placement === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0)",
                    }}
                >
                    <IconComponent
                        icon={closeIcon}
                        alt="close"
                        className={styles.clusterPopupClose}
                        onClick={() => setClusterPopup(null)}
                    />
                    <h3 className={styles.clusterModalTitle}>{vacancyListTitle}</h3>
                    <ul className={styles.clusterModalList}>
                        {clusterPopup.offers.map((offer) => (
                            <li key={offer.id} className={styles.clusterModalItem}>
                                <a href={offer.url} className={styles.clusterModalLink}>
                                    <img
                                        src={offer.image}
                                        alt={offer.name}
                                        className={styles.clusterModalImage}
                                    />
                                    <div className={styles.clusterModalText}>
                                        <span className={styles.clusterModalName}>
                                            {offer.name}
                                        </span>
                                        <span
                                            className={styles.clusterModalCategory}
                                            style={{ color: offer.categoryColor }}
                                        >
                                            {offer.categoryName}
                                        </span>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div
                        className={cn(styles.clusterPopupTail, {
                            [styles.clusterPopupTailBottom]: clusterPopup.placement === "top",
                            [styles.clusterPopupTailTop]: clusterPopup.placement === "bottom",
                        })}
                        style={{ left: `calc(50% + ${clusterPopup.tailOffset}px)` }}
                    />
                </div>
            )}
        </div>
    );
});
