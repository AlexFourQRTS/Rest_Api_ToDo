import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { MapPin, Calendar, GraduationCap, Languages, User, University, IdCard, Medal, Trophy, Check } from "lucide-react";
import PageHero from '@/components/PageHero';
import styles from './styles.module.css';

export default function About() {
  const [match, params] = useRoute("/about/:tab");
  const [, setLocation] = useLocation();
  const activeTab = params?.tab || "personal";

  const [currentTab, setCurrentTab] = useState("personal");

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const switchTab = (tab: string) => {
    setCurrentTab(tab);
    setLocation(`/about/${tab}`);
  };

  const tabs = [
    { id: "personal", label: "Личная информация" },
    { id: "professional", label: "Профессиональная" },
    { id: "skills", label: "Навыки и экспертиза" }
  ];

  const interests = ["Веб-разработка", "Игровые технологии", "Системное администрирование", "Десктоп приложения", "Парсинг данных"];

  const experiences = [
    {
      title: "Full Stack Developer",
      company: "Freelance (Upwork)",
      period: "2022 - Настоящее время",
      description: "Разработка веб и десктоп приложений с использованием React, Node.js, Electron. Создание игровых инструментов Overwolf для League of Legends.",
      color: "primary"
    },
    {
      title: "System Administrator",
      company: "Различные проекты",
      period: "2017 - 2022",
      description: "Администрирование серверов Linux, настройка Docker, Nginx, HTTPS. Обеспечение надежной инфраструктуры для веб-приложений.",
      color: "purple"
    },
    {
      title: "Backend Developer",
      company: "Локальные проекты",
      period: "2015 - 2017",
      description: "Разработка серверных решений, работа с базами данных, создание API и интеграций.",
      color: "green"
    }
  ];

  const education = [
    { icon: University, title: "Магистр информационных технологий (MIT)", subtitle: "Одесский национальный технологический университет, Факультет информационных технологий и кибербезопасности, 2011-2015", color: "primary" },
    { icon: GraduationCap, title: "Школа №1", subtitle: "Общее образование, 2011-2015", color: "purple" },
    { icon: Medal, title: "React специалист", subtitle: "Meta (Facebook), 2021", color: "green" },
    { icon: Trophy, title: "Scrum Master сертификация", subtitle: "Scrum Alliance, 2020", color: "amber" }
  ];

  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        { name: "React", level: 5 },
        { name: "TypeScript", level: 4 },
        { name: "HTML", level: 5 },
        { name: "JavaScript", level: 5 }
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "Node.js", level: 5 },
        { name: "Express", level: 4 },
        { name: "WebSockets", level: 4 },
        { name: "Linux", level: 4 }
      ]
    },
    {
      title: "Инструменты и технологии",
      skills: [
        { name: "Electron", level: 5 },
        { name: "Docker", level: 4 },
        { name: "NGINX", level: 4 },
        { name: "A-Parser", level: 4 }
      ]
    },
    {
      title: "Специализация",
      skills: [
        { name: "Overwolf Apps", level: 5 },
        { name: "Gaming Console", level: 4 },
        { name: "Data Scraping", level: 4 },
        { name: "Cross-Platform Apps", level: 5 }
      ]
    }
  ];

  const competencies = {
    development: [
      "Full-Stack веб-разработка с React и Node.js",
      "Кроссплатформенные десктоп приложения на Electron", 
      "Игровые инструменты для Overwolf (League of Legends)",
      "Парсинг данных с помощью Puppeteer",
      "Настройка серверов: Docker, Nginx, HTTPS"
    ],
    soft: [
      "Работа с международными клиентами",
      "Английский - свободно",
      "Русский и украинский - родной",
      "Самостоятельная работа на фрилансе",
      "Адаптация под требования клиента"
    ]
  };

  const renderSkillLevel = (level: number) => {
    return (
      <div className={styles.skillLevel}>
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`${styles.skillDot} ${
              dot <= level ? styles.skillDotActive : styles.skillDotInactive
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Profile Photo Section */}
      <div className={styles.photoSection}>
        <div className={styles.photoContainer}>
          <div className={styles.avatar}>
            <User size={64} color="#e67e22" />
          </div>
          <h1 className={styles.name}>Александр Малюк</h1>
          <p className={styles.role}>Full-Stack Developer</p>
          <p className={styles.location}>Одесса, Украина</p>
          <div className={styles.contactButtons}>
            <button 
              onClick={() => window.location.href = '/contact'}
              className={styles.contactBtn}
            >
              Связаться
            </button>
            <button 
              onClick={() => window.location.href = '/portfolio'}
              className={styles.portfolioBtn}
            >
              Портфолио
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.tabsContainer}>
        <nav className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`${styles.tab} ${
                currentTab === tab.id ? styles.activeTab : styles.inactiveTab
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {currentTab === "personal" && (
        <div className={styles.content}>
          <div className={styles.personalGrid}>
            <div className={styles.mainContent}>
              <div className={styles.card}>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>Личная информация</h2>
                  <div className={styles.prose}>
                    <p className={styles.text}>
                      Привет! Я Full-Stack разработчик с 2+ годами опыта создания веб и десктоп приложений. 
                      Создаю масштабируемые, современные решения, адаптированные под ваши цели.
                    </p>
                    <p className={styles.text}>
                      Специализируюсь на веб-приложениях с React и Node.js, кроссплатформенных решениях с Electron, 
                      игровых инструментах Overwolf для League of Legends. С 5+ годами опыта системного администрирования 
                      обеспечиваю надежную настройку серверов.
                    </p>
                  </div>
                  
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <Calendar className={styles.infoIcon} size={16} />
                      <span className={styles.infoText}>Доступен для проектов ($15/час)</span>
                    </div>
                    <div className={styles.infoItem}>
                      <GraduationCap className={styles.infoIcon} size={16} />
                      <span className={styles.infoText}>Магистр IT, ОНУ</span>
                    </div>
                    <div className={styles.infoItem}>
                      <Languages className={styles.infoIcon} size={16} />
                      <span className={styles.infoText}>Английский (свободно), Русский, Украинский</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.sidebar}>
              <div className={styles.card}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Интересы</h3>
                  <div className={styles.interestsGrid}>
                    {interests.map((interest) => (
                      <span key={interest} className={styles.interestTag}>
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === "professional" && (
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Профессиональный опыт</h2>
              
              <div className={styles.timeline}>
                {experiences.map((exp, index) => (
                  <div key={index} className={`${styles.timelineItem} ${styles[`timeline${exp.color}`]}`}>
                    <div className={`${styles.timelineDot} ${styles[`dot${exp.color}`]}`}></div>
                    <div className={styles.timelineHeader}>
                      <h3 className={styles.timelineTitle}>{exp.title}</h3>
                      <span className={styles.timelinePeriod}>{exp.period}</span>
                    </div>
                    <p className={styles.timelineCompany}>{exp.company}</p>
                    <p className={styles.timelineDescription}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Образование и сертификации</h2>
              
              <div className={styles.educationGrid}>
                {education.map((edu, index) => {
                  const Icon = edu.icon;
                  return (
                    <div key={index} className={styles.educationCard}>
                      <div className={styles.educationHeader}>
                        <Icon className={`${styles.educationIcon} ${styles[edu.color]}`} size={20} />
                        <h3 className={styles.educationTitle}>{edu.title}</h3>
                      </div>
                      <p className={styles.educationSubtitle}>{edu.subtitle}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === "skills" && (
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Технические навыки</h2>
              
              <div className={styles.skillsGrid}>
                {skillCategories.map((category) => (
                  <div key={category.title}>
                    <h3 className={styles.skillCategory}>{category.title}</h3>
                    <div className={styles.skillsList}>
                      {category.skills.map((skill) => (
                        <div key={skill.name} className={styles.skillItem}>
                          <span className={styles.skillName}>{skill.name}</span>
                          {renderSkillLevel(skill.level)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Основные компетенции</h2>
              
              <div className={styles.competenciesGrid}>
                <div>
                  <h3 className={styles.competencyCategory}>Разработка</h3>
                  <ul className={styles.competencyList}>
                    {competencies.development.map((comp) => (
                      <li key={comp} className={styles.competencyItem}>
                        <Check className={styles.competencyIcon} size={16} />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className={styles.competencyCategory}>Мягкие навыки</h3>
                  <ul className={styles.competencyList}>
                    {competencies.soft.map((comp) => (
                      <li key={comp} className={styles.competencyItem}>
                        <Check className={styles.competencyIcon} size={16} />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}