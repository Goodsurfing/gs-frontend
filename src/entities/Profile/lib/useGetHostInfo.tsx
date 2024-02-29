import { useEffect, useState } from "react";
import { Host, hostApi } from "@/entities/Host";

export function useGetUserHostInfo() {
    const [getHostInfo, { error, isLoading }] = hostApi.useLazyGetHostsQuery();
    const [hostData, setHostData] = useState<Host[]>();

    useEffect(() => {
        getHostInfo().then((res) => {
            if (res.data && res.data.list) {
                setHostData(res.data.list);
            }
        });
    }, [getHostInfo]);

    if (error) {
        if ("status" in error) {
            const errMsg = "error" in error ? error.error : JSON.stringify(error.data);
            return {
                host: hostData?.[0],
                isLoading,
                error: errMsg,
            };
        }
        return {
            host: hostData?.[0],
            isLoading,
            error: error.message,
        };
    }

    return {
        host: hostData?.[0],
        isLoading,
        error,
    };
}
