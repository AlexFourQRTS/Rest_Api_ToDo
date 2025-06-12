import { ArrowRight, Code, Rocket, Zap } from "lucide-react";
import styles from './styles.module.css';

export default function Home() {
  const stats = [
    {
      number: "2+",
      label: "Года опыта"
    },
    {
      number: "$15",
      label: "За час"
    },
    {
      number: "5+",
      label: "Лет сисадминства"
    },
    {
      number: "3",
      label: "Языка"
    }
  ];

  const features = [
    {
      icon: Code,
      title: "Full-Stack разработка",
      description: "Веб-приложения на React и Node.js, адаптивный дизайн, WebSockets для реального времени",
      button: "Подробнее"
    },
    {
      icon: Rocket,
      title: "Десктоп приложения",
      description: "Кроссплатформенные решения на Electron, игровые инструменты Overwolf для League of Legends",
      button: "Узнать больше"
    },
    {
      icon: Zap,
      title: "DevOps и серверы",
      description: "Настройка Docker, Nginx, HTTPS, развертывание, парсинг данных с Puppeteer",
      button: "Связаться"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Александр Малюк - <span className={styles.heroHighlight}>Full-Stack</span> разработчик
          </h1>
          <p className={styles.heroSubtitle}>
            Создаю масштабируемые веб и десктоп приложения на React, Node.js, Electron. 
            Специализируюсь на игровых инструментах Overwolf и настройке серверной инфраструктуры.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryButton}>
              Начать проект
              <ArrowRight size={20} />
            </button>
            <button className={styles.secondaryButton}>
              Посмотреть портфолио
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>Мои услуги</h2>
          <p className={styles.featuresSubtitle}>
            Создаю современные решения, адаптированные под ваши цели. Работаю с международными клиентами на Upwork.
          </p>
          
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <Icon size={32} />
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                  <a href="#" className={styles.featureButton}>
                    {feature.button}
                    <ArrowRight size={16} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Готовы начать проект?</h2>
          <p className={styles.ctaSubtitle}>
            Свяжитесь со мной для обсуждения вашего проекта. Работаю с клиентами по всему миру, 
            обеспечиваю качественный код и клиентоориентированные результаты.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryButton}>
              Написать на Upwork
              <ArrowRight size={20} />
            </button>
            <button className={styles.secondaryButton}>
              Посмотреть портфолио
            </button>
          </div>
          <div className={styles.ctaInfo}>
            <p className={styles.ctaLocation}>📍 Одесса, Украина</p>
            <p className={styles.ctaRate}>💰 $15/час • Доступен для проектов</p>
          </div>
        </div>
      </section>
    </div>
  );
}