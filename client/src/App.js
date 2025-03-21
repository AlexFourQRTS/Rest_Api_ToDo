import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/User/UserPage";
import AdminPage from "./pages/Admin/AdminPage";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import { routes } from "./routes";
import NavBar from "./components/NavBar";


function App() {
  return (
    <>
      <br />
      <BrowserRouter>
          <NavBar />
          <Routes >
            <Route path={routes.login} element={<AuthPage />} />
            <Route path={routes.register} element={<RegisterPage />} />
            <Route path={routes.home} element={<Home />} />
            
            <Route  element={<PrivateRoute />}>
              <Route path={routes.user} element={<UserPage />} />
              <Route path={routes.admin} element={<AdminPage />} />
            </Route>
          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
