import React, { useState } from "react";
import translations from "./servicesTranslations.json";
import styles from "./News.module.css";
import PageWrap from "../../components/UI/PageWrap/PageWrap";
import Hero from "../../components/UI/Hero/Hero";

// Sample news data (replace with API fetch if needed)
const newsData = [
  {
    id: 1,
    category: "tech",
    date: "December 3, 2024",
    readTime: "3 min read",
    title: "React 19 Released: New Features and Breaking Changes",
    description:
      "React 19 brings significant improvements including automatic batching, concurrent features, and new hooks. Here's what developers need to know about the migration process.",
    tags: ["React", "JavaScript", "Frontend"],
    featured: true,
  },
  {
    id: 2,
    category: "projects",
    date: "December 2, 2024",
    readTime: "2 min read",
    title: "New Portfolio Website Launch",
    description:
      "Excited to announce the launch of my redesigned portfolio website featuring improved performance and modern design patterns.",
    tags: ["Portfolio", "Design"],
    featured: false,
  },
  {
    id: 3,
    category: "tech",
    date: "December 1, 2024",
    readTime: "4 min read",
    title: "TypeScript 5.3: Enhanced Type Safety",
    description:
      "Latest TypeScript release introduces improved type inference, better error messages, and new utility types for enhanced developer experience.",
    tags: ["TypeScript", "Programming"],
    featured: false,
  },
  {
    id: 4,
    category: "industry",
    date: "November 30, 2024",
    readTime: "5 min read",
    title: "AI in Web Development: Current Trends",
    description:
      "Exploring how artificial intelligence is transforming web development workflows, from code generation to automated testing.",
    tags: ["AI", "Web Development", "Automation"],
    featured: false,
  },
  {
    id: 5,
    category: "updates",
    date: "November 29, 2024",
    readTime: "1 min read",
    title: "Blog Section Enhancement",
    description:
      "Added new search functionality and improved filtering system to the blog section for better content discovery.",
    tags: ["Blog", "Features"],
    featured: false,
  },
  {
    id: 6,
    category: "tech",
    date: "November 28, 2024",
    readTime: "6 min read",
    title: "Modern CSS Grid Techniques",
    description:
      "Advanced CSS Grid layouts and techniques for creating responsive, accessible web interfaces with minimal code.",
    tags: ["CSS", "Grid", "Responsive"],
    featured: false,
  },
];

const servicesIcons = [
  { name: "Web Development", icon: "https://cdn.simpleicons.org/react/61dafb" },
  { name: "Desktop Applications", icon: "https://cdn.simpleicons.org/electron/9feaf5" },
  { name: "Admin Panels", icon: "https://cdn.simpleicons.org/nestjs/e0234e" },
  { name: "Data Parsers", icon: "https://cdn.simpleicons.org/puppeteer/40c4ff" },
  { name: "Server Setup", icon: "https://cdn.simpleicons.org/nginx/009639" },
  { name: "System Administration", icon: "https://cdn.simpleicons.org/linuxmint/87cf3e" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
];

const News = () => {
  const [language, setLanguage] = useState("en");
  const [filter, setFilter] = useState("all");
  const [visibleItems, setVisibleItems] = useState(3); // Initial number of news items to show
  const t = translations[language];

  // Filter news based on category
  const filteredNews = filter === "all" ? newsData : newsData.filter((news) => news.category === filter);

  // Handle "Load More" button
  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + 3);
  };

  return (
    <PageWrap>
      <div className={styles.services}>
        <div className={styles.languageSwitcher}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={styles.languageSelect}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <section className={styles.intro}>
          <Hero title={t.title} />
        </section>

        <section className={styles.servicesList}>
          <div className={styles.servicesGrid}>
            {t.services.map((service, index) => (
              <div key={service.name} className={styles.serviceItem}>
                <img
                  src={servicesIcons[index].icon}
                  alt={`${service.name} icon`}
                  className={styles.serviceIcon}
                />
                <h3 className={styles.serviceTitle}>{service.name}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* News Section */}
        <section className={styles.newsContainer}>
          <div className={styles.newsHeader}>
            <h1>{t.newsTitle || "Latest News"}</h1>
            <p>
              {t.newsDescription ||
                "Stay updated with the latest developments in web development, technology trends, and project updates."}
            </p>
          </div>

          <div className={styles.newsFilters}>
            {["all", "tech", "projects", "updates", "industry"].map((category) => (
              <button
                key={category}
                className={`${styles.filterBtn} ${filter === category ? styles.active : ""}`}
                onClick={() => setFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.newsGrid}>
            {filteredNews.slice(0, visibleItems).map((news) => (
              <article
                key={news.id}
                className={`${styles.newsCard} ${news.featured ? styles.featured : ""}`}
              >
                <div className={styles.newsImage}>
                  <div className={styles.imagePlaceholder}>
                    <span className={styles.newsCategory}>{news.category}</span>
                  </div>
                </div>
                <div className={styles.newsContent}>
                  <div className={styles.newsMeta}>
                    <span className={styles.newsDate}>{news.date}</span>
                    <span className={styles.readTime}>{news.readTime}</span>
                  </div>
                  <h2 className={styles.newsTitle}>{news.title}</h2>
                  <p className={styles.newsDescription}>{news.description}</p>
                  <div className={styles.newsTags}>
                    {news.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href="#" className={styles.readMore}>
                    {t.readMore || "Read More"}
                  </a>
                </div>
              </article>
            ))}
          </div>

          {visibleItems < filteredNews.length && (
            <div className={styles.loadMoreSection}>
              <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
                {t.loadMore || "Load More News"}
              </button>
            </div>
          )}
        </section>
      </div>
    </PageWrap>
  );
};

export default News;