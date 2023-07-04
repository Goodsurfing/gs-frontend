import { FC } from "react";

import { Outlet } from "react-router-dom";

const App: FC = () => {
    console.log("App");
    return (
        <div className="app">
            <Outlet />
        </div>
    );
};

export default App;
