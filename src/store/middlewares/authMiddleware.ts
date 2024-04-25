import { Middleware } from "@reduxjs/toolkit";
import { userActions } from "@/entities/User";

export const authMiddleware: Middleware = ({ dispatch }) => (next) => (action) => {
    if (action.type.endsWith("/rejected")) {
        const { payload } = action;
        if (payload && payload.data && payload.data.code === 401) {
            dispatch(userActions.logout());
        }
    }
    return next(action);
};
