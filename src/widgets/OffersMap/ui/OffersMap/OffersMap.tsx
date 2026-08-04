import {
    Map, ObjectManager, ZoomControl,
} from "@pbe/react-yandex-maps";
import cn from "classnames";
import React, {
    FC, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { YmapType } from "@/entities/Map";
import defaultImage from "@/shared/assets/images/default-offer-image.png";

import "./yandex-map-restyle-ballon.scss";
import { OfferMap } from "@/entities/Offer";
import styles from "./OffersMap.module.scss";
import Button from "@/shared/ui/Button/Button";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Text } from "@/shared/ui/Text/Text";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";

const FOCUS_ZOOM = 10;
const BOUNDS_CHANGE_DEBOUNCE_MS = 400;
const MAP_LOAD_TIMEOUT_MS = 15_000;

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
    const attemptOpenBalloon = (offerId: number): boolean => {
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
        if (!selectedOfferId || selectedOfferCoordinates === undefined) {
            setShowNoLocationNotice(false);
            pendingBalloonOfferIdRef.current = null;
            panActionEndedRef.current = false;
            return undefined;
        }

        // Часть вакансий физически не имеет координат в базе (адрес не
        // геокодирован) — карте попросту нечем "сфокусироваться". Раньше
        // клик по такой карточке в списке просто ничего не делал молча,
        // что выглядело как баг; показываем явную причину вместо тишины.
        setShowNoLocationNotice(selectedOfferCoordinates === null);
        if (!selectedOfferCoordinates || !mapRef.current) return undefined;

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
    useEffect(() => {
        // panActionEndedRef: не пытаться открыть balloon раньше, чем
        // закончится сам pan — иначе табличка выскакивала бы мгновенно при
        // клике, до того как карта успевала визуально долететь до маркера.
        if (panActionEndedRef.current && pendingBalloonOfferIdRef.current !== null) {
            attemptOpenBalloon(pendingBalloonOfferIdRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [features]);

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
    const showEmptyNotice = !isOffersError && !isOffersLoading
        && !!ymapState && features.length === 0;

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
        clusterBalloonContentLayout: ymapState.templateLayoutFactory.createClass(`
            <div class="${styles.clusterBalloon}">
                <h3>${vacancyListTitle}</h3>
                <ul>
                    {% for geoObject in properties.geoObjects %}
                        <li> <a href="{{geoObject.properties.url}}">{{ geoObject.properties.name }}</a></li>
                    {% endfor %}
                </ul>
            </div>
        `),
        clusterBalloonPanelMaxMapArea: Infinity,
        clusterBalloonContentLayoutHeight: 200,
    } : undefined), [ymapState?.templateLayoutFactory, vacancyListTitle]);

    return (
        <div className={cn(className, styles.wrapper)}>
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
            {!mapLoadTimedOut && isOffersLoading && (
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
        </div>
    );
});
