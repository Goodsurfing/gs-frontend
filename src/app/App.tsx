import { FC, useEffect } from "react";

import { YMaps } from "@pbe/react-yandex-maps";
import { SidebarProvider } from "@/widgets/Sidebar";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { getUserInited, userActions } from "@/entities/User";
import { LangRouter } from "@/routes";
import { MessengerProvider } from "./providers/MessengerProvider/ui/MessengerProvider";
import { AuthProvider } from "@/routes/model/guards/AuthProvider";

export const App: FC = () => {
    const dispatch = useAppDispatch();
    const inited = useAppSelector(getUserInited);

    useEffect(() => {
        dispatch(userActions.initAuthData());
    }, [dispatch]);

    return (
        <YMaps query={{
            apikey: import.meta.env.VITE_API_YANDEX_KEY,
            load: "package.full",
        }}
        >
            <div className="app app_default_theme">
                <AuthProvider>
                    <MessengerProvider>
                        <SidebarProvider initialValue={{ isOpen: true }}>
                            {inited && <LangRouter />}
                        </SidebarProvider>
                    </MessengerProvider>
                </AuthProvider>
            </div>
        </YMaps>
    );
};
