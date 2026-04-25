import { type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { setupStore, type AppStore } from "@/store/store";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
    store?: AppStore;
}

export function renderWithProviders(
    ui: React.ReactElement,
    { store = setupStore(), ...renderOptions }: ExtendedRenderOptions = {},
) {
    // eslint-disable-next-line react/function-component-definition
    const Wrapper = ({ children }: { children?: ReactNode }) => (
        <Provider store={store}>{children}</Provider>
    );
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
