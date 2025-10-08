import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { routes } from "../../routes";
import { Home, ArrowLeft } from "lucide-react";

export const NotFoundPage = () => {
  useEffect(() => {
    console.log("404 Error Page visited:", {
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950 to-purple-900">
      <div className="text-center max-w-2xl mx-auto px-4">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold gradient-text">404</h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Страница не найдена
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={routes.home}
            className="btn-primary inline-flex items-center justify-center space-x-2"
          >
            <Home size={20} />
            <span>На главную</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Назад</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>Если вы считаете, что это ошибка, пожалуйста, свяжитесь с нами.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;