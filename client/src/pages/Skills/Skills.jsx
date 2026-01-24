import React from "react";
import translations from "./skillsTranslations.json";
import Hero from "../../components/UI/Hero/Hero";
import useLanguage from "../../hooks/useLanguage";

const skills = [
  // Backend Frameworks
  { name: "NestJS", icon: "https://cdn.simpleicons.org/nestjs/e0234e" },
  { name: "Express", icon: "https://cdn.simpleicons.org/express/000000" },
  
  // Message Brokers
  { name: "Kafka", icon: "https://cdn.simpleicons.org/apachekafka/231f20" },
  { name: "RabbitMQ", icon: "https://cdn.simpleicons.org/rabbitmq/ff6600" },
  
  // Databases & Caching
  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/336791" },
  { name: "Redis", icon: "https://cdn.simpleicons.org/redis/dc382d" },
  
  // ORM
  { name: "Prisma", icon: "https://cdn.simpleicons.org/prisma/2d3748" },
  { name: "Sequelize", icon: "https://cdn.simpleicons.org/sequelize/52b0e7" },
  
  // Languages & API
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178c6" },
  { name: "GraphQL", icon: "https://cdn.simpleicons.org/graphql/e10098" },
  { name: "REST API", icon: "https://cdn.simpleicons.org/fastapi/009688" },
  { name: "Swagger", icon: "https://cdn.simpleicons.org/swagger/85ea2d" },
  
  // Frontend
  { name: "React", icon: "https://cdn.simpleicons.org/react/61dafb" },
  
  // WebSocket
  { name: "WebSocket", icon: "https://cdn.simpleicons.org/socketdotio/010101" },
  
  // DevOps & Infrastructure
  { name: "Docker", icon: "https://cdn.simpleicons.org/docker/0db7ed" },
  { name: "Kubernetes", icon: "https://cdn.simpleicons.org/kubernetes/326ce5" },
  { name: "Nginx", icon: "https://cdn.simpleicons.org/nginx/009639" },
  { name: "CI/CD", icon: "https://cdn.simpleicons.org/githubactions/2088ff" },
  
  // Security
  { name: "SSL/TLS", icon: "https://cdn.simpleicons.org/letsencrypt/003a70" },
];

const tools = [
  { name: "Linux Mint", icon: "https://cdn.simpleicons.org/linuxmint/87cf3e" },
  { name: "Git", icon: "https://cdn.simpleicons.org/git/f05032" },
  { name: "Notion", icon: "https://cdn.simpleicons.org/notion/000000" },
  { name: "Jira", icon: "https://cdn.simpleicons.org/jira/0052cc" },
];

const Skills = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage] || translations['en'];

  return (
    <div className="min-h-screen">
      <section className="section-padding">
        <Hero title={t.title} />
      </section>

      <section className="container-custom pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div key={skill.name} className="card p-4 text-center">
              <img
                src={skill.icon}
                alt={`${skill.name} icon`}
                className="w-12 h-12 mx-auto mb-2"
              />
              <h3 className="text-sm font-medium text-white">{skill.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="container-custom pb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.toolsSection}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <div key={tool.name} className="card p-4 text-center">
              <img
                src={tool.icon}
                alt={`${tool.name} icon`}
                className="w-12 h-12 mx-auto mb-2"
              />
              <h3 className="text-sm font-medium text-white">{tool.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Skills;