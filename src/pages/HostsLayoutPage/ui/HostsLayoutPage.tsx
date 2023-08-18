import { Outlet } from "react-router-dom";

import { useCallback } from "react";
import { HostPagesSidebarData } from "@/shared/data/sidebar/host-pages";

import { useGetHostInfo } from "@/features/HostDescription";

import { PageLayout } from "@/widgets/PageLayout";

import { fillSidebarData } from "../lib/fillSidebarData";
import Preloader from "@/shared/ui/Preloader/Preloader";

export const HostsLayoutPage = () => {
    const { host, isLoading, error } = useGetHostInfo();

    const sidebarContent = useCallback(() => {
        if (!isLoading && host) {
            return fillSidebarData(HostPagesSidebarData);
        }
        return HostPagesSidebarData;
    }, [host, isLoading]);

    return (
        <>
            {isLoading && (<Preloader />)}
            {!isLoading && host && sidebarContent() && (
                <PageLayout sidebarContent={sidebarContent()}>
                    <Outlet />
                </PageLayout>

            )}
        </>
    );
};
