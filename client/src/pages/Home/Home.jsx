import React from "react";
import { Link } from "react-router-dom";
import translations from "./homeTranslations.json";
import Hero from "../../components/UI/Hero/Hero";
import useLanguage from "../../hooks/useLanguage";
import { 
  Code, 
  Cloud, 
  Gamepad2, 
  Users, 
  BookOpen
} from "lucide-react";

const routesInfo = [
  {
    path: "/skills",
    title: "skills_title",
    description: "skills_description",
    icon: Code,
  },
  {
    path: "/filecloud",
    title: "filecloud",
    description: "filecloud_description",
    icon: Cloud,
  },
  {
    path: "/games",
    title: "emul_page",
    description: "emul_page_description",
    icon: Gamepad2,
  },
  {
    path: "/chat",
    title: "forum_page",
    description: "forum_page_description",
    icon: Users,
  },
  {
    path: "/blog",
    title: "blog_page",
    description: "blog_description",
    icon: BookOpen,
  },
];

const Home = () => {
  const { currentLanguage: language } = useLanguage();
  const t = translations[language] || translations['en'];

  return (
    <div className="min-h-screen">
      <section>
        <Hero title={t.title} subtitle={t.intro} />

        {/* Routes Grid */}
        <div className="container-custom pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routesInfo.map((route) => {
              const Icon = route.icon;
              return (
                <div
                  key={route.path}
                  className="card-hover p-6 group cursor-pointer"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-slate-600/20 to-purple-600/20 rounded-lg group-hover:from-slate-600/40 group-hover:to-purple-600/40 border border-slate-500/20 group-hover:border-slate-400/40">
                      <Icon size={32} className="text-gray-300 group-hover:text-gray-300" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t[route.title]}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {t[route.description]}
                  </p>
                  
                  <Link 
                    to={route.path} 
                    className="inline-flex items-center text-gray-300 hover:text-gray-300 font-medium"
                  >
                    Перейти
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;