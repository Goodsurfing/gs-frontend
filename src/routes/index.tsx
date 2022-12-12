import React from "react";
import {Route, Routes} from "react-router-dom";
import SignUpPage from "@/pages/SignUpPage/SignUpPage";
import SignInPage from "@/pages/SignInPage/SignInPage";
import MainPage from "@/pages/MainPage/MainPage";

export const AppRoutes = () => {
    console.log("routes");
    return (
        <Routes>
            <Route path={"/:ln"} element={<MainPage />} />
            <Route path={"/:ln/signup"} element={<SignUpPage />} />
            <Route path={"/:ln/signin"} element={<SignInPage />} />
        </Routes>
    );
}