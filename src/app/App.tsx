import { FC } from "react";

import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/widgets/Sidebar";

const App: FC = () => (
    <div className="app">
        <SidebarProvider initialValue={{ isOpen: true }}>
            <Outlet />
        </SidebarProvider>
    </div>
);

export default App;
