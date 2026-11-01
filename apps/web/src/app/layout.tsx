import type { ReactNode } from "react";

// Корневой layout минимален: <html> рендерит [locale]/layout, где известен язык
export default function RootLayout({ children }: { children: ReactNode }) {
    return children;
}
