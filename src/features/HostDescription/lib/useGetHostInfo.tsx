import { useEffect, useState } from "react";
import { Host, hostApi } from "@/entities/Host";

export function useGetHostInfo() {
    const [getHostInfo, { error, isLoading }] = hostApi.useLazyGetHostsQuery();
    const [hostData, setHostData] = useState<Host[]>();
    useEffect(() => {
        getHostInfo().then((res) => {
            if (res.data && res.data.list) {
                setHostData(res.data.list);
            }
        });
    }, [getHostInfo]);

    if (error?.error) {
        return {
            host: hostData?.[0],
            isLoading,
            error: error?.error,
        };
    }

    return {
        host: hostData?.[0],
        isLoading,
        error,
    };
}
