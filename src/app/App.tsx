import { FC, useEffect } from "react";

import { SidebarProvider } from "@/widgets/Sidebar";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { getUserInited, userActions } from "@/entities/User";
import { LangRouter } from "@/routes";

export const App: FC = () => {
    const dispatch = useAppDispatch();
    const inited = useAppSelector(getUserInited);

    useEffect(() => {
        dispatch(userActions.initAuthData());
    }, [dispatch]);

    return (
        <div className="app">
            <SidebarProvider initialValue={{ isOpen: true }}>
                {inited && <LangRouter />}
            </SidebarProvider>
        </div>
    );
};
