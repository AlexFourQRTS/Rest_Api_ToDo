import React, { useState } from "react";
import translations from "./translations.json";
import Hero from "../../components/UI/Hero/Hero";

const developmentTools = [
  { name: "VS Code", icon: "https://cdn.simpleicons.org/visualstudiocode/007acc" },
  { name: "WebStorm", icon: "https://cdn.simpleicons.org/webstorm/000000" },
  { name: "Postman", icon: "https://cdn.simpleicons.org/postman/ff6c37" },
  { name: "Insomnia", icon: "https://cdn.simpleicons.org/insomnia/4000bf" },
  { name: "DBeaver", icon: "https://cdn.simpleicons.org/dbeaver/372923" },
  { name: "MongoDB Compass", icon: "https://cdn.simpleicons.org/mongodb/47a248" },
];

const designTools = [
  { name: "Figma", icon: "https://cdn.simpleicons.org/figma/f24e1e" },
  { name: "Adobe XD", icon: "https://cdn.simpleicons.org/adobexd/ff61f6" },
  { name: "Sketch", icon: "https://cdn.simpleicons.org/sketch/fdb300" },
  { name: "InVision", icon: "https://cdn.simpleicons.org/invision/ff3366" },
];

const testingTools = [
  { name: "Jest", icon: "https://cdn.simpleicons.org/jest/c21325" },
  { name: "Cypress", icon: "https://cdn.simpleicons.org/cypress/17202c" },
  { name: "Playwright", icon: "https://cdn.simpleicons.org/playwright/2ead33" },
  { name: "Selenium", icon: "https://cdn.simpleicons.org/selenium/43b02a" },
];

const deploymentTools = [
  { name: "Docker", icon: "https://cdn.simpleicons.org/docker/0db7ed" },
  { name: "Kubernetes", icon: "https://cdn.simpleicons.org/kubernetes/326ce5" },
  { name: "AWS", icon: "https://cdn.simpleicons.org/amazonaws/232f3e" },
  { name: "Vercel", icon: "https://cdn.simpleicons.org/vercel/000000" },
  { name: "Netlify", icon: "https://cdn.simpleicons.org/netlify/00c7b7" },
  { name: "Heroku", icon: "https://cdn.simpleicons.org/heroku/430098" },
];

const monitoringTools = [
  { name: "Sentry", icon: "https://cdn.simpleicons.org/sentry/362d59" },
  { name: "LogRocket", icon: "https://cdn.simpleicons.org/logrocket/764abc" },
  { name: "New Relic", icon: "https://cdn.simpleicons.org/newrelic/008c99" },
  { name: "Grafana", icon: "https://cdn.simpleicons.org/grafana/f46800" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "uk", name: "Українська" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
];

const Tools = () => {
  const [language, setLanguage] = useState("en");
  const t = translations[language];

  return (
    <div className="min-h-screen">
      <div className="fixed top-20 right-4 z-30">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800/80 border border-slate-500/30 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 backdrop-blur-sm"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <section className="section-padding">
        <Hero title={t.title} subtitle={t.intro} />
      </section>

      <section className="container-custom pb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.developmentTools}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {developmentTools.map((tool) => (
            <div
              key={tool.name}
              className="card-hover p-4 text-center"
            >
              <img
                src={tool.icon}
                alt={`${tool.name} icon`}
                className="w-12 h-12 mx-auto mb-2"
              />
              <span className="text-sm text-white">{t.toolNames[tool.name]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container-custom pb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.designTools}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {designTools.map((tool) => (
            <div
              key={tool.name}
              className="card-hover p-4 text-center"
            >
              <img
                src={tool.icon}
                alt={`${tool.name} icon`}
                className="w-12 h-12 mx-auto mb-2"
              />
              <span className="text-sm text-white">{t.toolNames[tool.name]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container-custom pb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.testingTools}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {testingTools.map((tool) => (
            <div
              key={tool.name}
              className="card-hover p-4 text-center"
            >
              <img
                src={tool.icon}
                alt={`${tool.name} icon`}
                className="w-12 h-12 mx-auto mb-2"
              />
              <span className="text-sm text-white">{t.toolNames[tool.name]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container-custom pb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.deploymentTools}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {deploymentTools.map((tool) => (
            <div
              key={tool.name}
              className="card-hover p-4 text-center"
            >
              <img
                src={tool.icon}
                alt={`${tool.name} icon`}
                className="w-12 h-12 mx-auto mb-2"
              />
              <span className="text-sm text-white">{t.toolNames[tool.name]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container-custom pb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.monitoringTools}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {monitoringTools.map((tool) => (
            <div
              key={tool.name}
              className="card-hover p-4 text-center"
            >
              <img
                src={tool.icon}
                alt={`${tool.name} icon`}
                className="w-12 h-12 mx-auto mb-2"
              />
              <span className="text-sm text-white">{t.toolNames[tool.name]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container-custom pb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.description}</h2>
        <p className="text-gray-400 text-center max-w-4xl mx-auto leading-relaxed">{t.descriptionText}</p>
      </section>
    </div>
  );
};

export default Tools;
