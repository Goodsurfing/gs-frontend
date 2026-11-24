"use client";

import { Component, type ReactNode } from "react";

/** Ловит ошибку в браузере и ничего не рисует — для NotFoundStatus */
export class SilentBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    render() {
        return this.state.failed ? null : this.props.children;
    }
}
