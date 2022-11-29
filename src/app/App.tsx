import { PublicRoutes } from "@/routes";
import React, { FC } from "react";
import { BrowserRouter } from "react-router-dom";

const App: FC = () => {
    return (
        <BrowserRouter>
            <PublicRoutes />
        </BrowserRouter>
    );
};

export default App;
