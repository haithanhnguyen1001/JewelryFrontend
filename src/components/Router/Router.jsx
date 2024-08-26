import { Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";

import React from "react";

const Router = () => {
  return (
    <Routes>
      {publicRoutes.map((route, index) => {
        const Page = route.component;
        return <Route key={index} path={route.path} element={<Page />} />;
      })}
    </Routes>
  );
};

export default Router;
