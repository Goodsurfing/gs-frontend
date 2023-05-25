import cn from "classnames";
import React, { FC, useState } from "react";
import ContentLoader from "react-content-loader";
import { Map as YMap, YMaps } from "react-yandex-maps";

import styles from "./YMap.module.scss";
import { IYandexMap, YMapType } from "./types/ymaps";

const YandexMap: FC<IYandexMap> = ({
  defaultLocation,
  location,
  width = "100%",
  height = "100%",
  zoom,
  ymap,
  setYmap,
  modules,
  className,
  children,
}) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  return (
      <YMaps query={{ apikey: process.env.REACT_APP_API_YANDEX_KEY }}>
          <YMap
              modules={modules}
              state={{ center: location ?? defaultLocation, zoom }}
              onLoad={(ymap) => {
                setLoading(false);
                setYmap(ymap);
              }}
              width={width}
              height={height}
              className={className}
          >
              {children}
          </YMap>
          {isLoading && (
          <ContentLoader
              speed={2}
              width={width}
              height={height}
              className={styles.isLoading}
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
          >
              <rect
                  x="0"
                  y="30"
                  rx="0"
                  ry="0"
                  width={width}
                  height={height}
              />
          </ContentLoader>
          )}
      </YMaps>
  );
};

export default YandexMap;
