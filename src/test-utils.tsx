import { type PropsWithChildren } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { type PreloadedState } from "@reduxjs/toolkit";
import { setupStore, type AppStore, type RootState } from "@/store/store";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
    preloadedState?: PreloadedState<RootState>;
    store?: AppStore;
}

export function renderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState = {},
        store = setupStore(preloadedState),
        ...renderOptions
    }: ExtendedRenderOptions = {},
) {
    // eslint-disable-next-line react/function-component-definition
    const Wrapper = ({ children }: PropsWithChildren<object>) => (
        <Provider store={store}>{children}</Provider>
    );
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
