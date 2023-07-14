import { FC, useEffect } from "react";

import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/widgets/Sidebar";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { getUserInited, userActions } from "@/entities/User";

const App: FC = () => {
    const dispatch = useAppDispatch();
    const inited = useAppSelector(getUserInited);

    useEffect(() => {
        dispatch(userActions.initAuthData());
    }, [dispatch]);

    return (
        <div className="app">
            <SidebarProvider initialValue={{ isOpen: true }}>
                {inited && <Outlet />}
            </SidebarProvider>
        </div>
    );
};

export default App;
