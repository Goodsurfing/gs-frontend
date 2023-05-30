import { setupListeners } from "@reduxjs/toolkit/dist/query/react";
import { FC, ReactNode } from "react";
import { Provider } from "react-redux";

import { StateSchema } from "../config/StateSchema";
import { createReduxStore } from "../config/store";

interface StoreProviderProps {
  children?: ReactNode;
  initialState?: StateSchema;
}

export const StoreProvider: FC<StoreProviderProps> = ({ children, initialState }) => {
  const store = createReduxStore(initialState);

  setupListeners(store.dispatch);

  return (
      <Provider store={store}>
          {children}
      </Provider>
  );
};
