import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { setupStore } from 'store/store';

import App from 'app/App';

import { ErrorBoundary } from 'app/providers/ErrorBoundary/ui/ErrorBoundary';

import './i18n';

import './styles/index.scss';

const root = createRoot(document.getElementById('root')!);

const store = setupStore();

const Root = (
    <Provider store={store}>
        <BrowserRouter>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </BrowserRouter>
    </Provider>
);

root.render(Root);
