import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { routes } from "./routes";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import LocalizationProvider from "./components/LocalizationProvider/LocalizationProvider";
import { ToastProvider } from "./context/ToastContext";

import Home from "./pages/Home/Home";

import Skills from "./pages/Skills/Skills";

import Tools from "./pages/Tools/Tools";
import Camera from "./pages/Tools/Camera/Camera";
import Microphone from "./pages/Tools/Microphone/Microphone";
import IP from "./pages/Tools/IP/IP";
import ToneGenerator from "./pages/Tools/ToneGenerator/ToneGenerator";

import Chat from "./pages/Chat/Chat";
import Blog from "./pages/Blog/Blog";
import Profile from "./pages/Profile/Profile";
import Games from "./pages/Games/Games";

import FileCloud from "./pages/FileCloud/FileCloud";
import FileDetail from "./pages/FileCloud/components/FileDetail/FileDetail";



import FooterPage from "./pages/Footer/Footer";
import {NotFoundPage} from "./pages/NotFoundPage/NotFoundPage";

import './utils/activityLogger';
import { logActivity } from './utils/activityLogger';

// Компонент для логирования изменений маршрута
const RouteChangeLogger = () => {
  const location = useLocation();

  useEffect(() => {
    logActivity('route_change', { path: location.pathname });
  }, [location]);

  return null;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Provider store={store}>
      <LocalizationProvider>
        <BrowserRouter>
          <ToastProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-purple-900">
              <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
              {/* Mobile overlay */}
              {isSidebarOpen && (
                <div 
                  className="fixed inset-0 bg-black/50 z-20 md:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
              <main className="min-h-screen">
                <RouteChangeLogger />
                <Routes>
                  <Route path={routes.home} element={<Home />} />
                  <Route path={routes.skills} element={<Skills />} />
                  <Route path={routes.tools} element={<Tools />} />
                  <Route path={routes.camera} element={<Camera />} />
                  <Route path={routes.microphone} element={<Microphone />} />
                  <Route path={routes.ip} element={<IP />} />
                  <Route path={routes.tone_generator} element={<ToneGenerator />} />
                  <Route path={routes.blog} element={<Blog />} />
                  <Route path={routes.filecloud} element={<FileCloud />} />
                  <Route path={routes.fileDetail} element={<FileDetail />} />
                  <Route path={routes.profile} element={<Profile />} />
                  <Route path={routes.chat} element={<Chat />} />
                  <Route path={routes.games} element={<Games />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <FooterPage />
            </div>
          </ToastProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;