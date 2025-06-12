// src/components/Sidebar/Sidebar.jsx
import React from 'react';

import styles from './SidebarBlog.module.css';

import Button from '../Shared/Button/Button';

export const SidebarBlog = ({ recentPosts, allTags, onTagFilter, onNewsletterSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    onNewsletterSubmit(email);
    e.target.reset(); // Reset form after submission
  };

  return (
    <aside className={styles.blogSidebar}>
      {/* Recent Posts Widget */}
      <div className={styles.sidebarWidget}>
        <h3>Recent Posts</h3>
        <div className={styles.recentPosts}>
          {recentPosts.map(post => (
            <div key={post.id} className={styles.recentPost}>
              <h4>{post.title}</h4>
              <span className={styles.recentDate}>
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tag Cloud Widget */}
      <div className={styles.sidebarWidget}>
        <h3>Tag Cloud</h3>
        <div className={styles.tagCloud}>
          {allTags.map(tag => (
            <span
              key={tag.name}
              className={styles.cloudTag}
              data-count={tag.count}
              onClick={() => onTagFilter(tag.name)}
              title={`Filter by ${tag.name}`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      {/* Newsletter Form Widget */}
      <div className={styles.sidebarWidget}>
        <h3>Join Our Newsletter</h3>
        <form className={styles.newsletterForm} onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Your email address" required />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </aside>
  );
};

