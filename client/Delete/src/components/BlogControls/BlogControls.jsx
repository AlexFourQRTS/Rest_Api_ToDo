// src/components/BlogControls/BlogControls.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './BlogControls.module.css';
import Button from '../Shared/Button/Button';

const BlogControls = ({ searchTerm, onSearchChange, onSearchSubmit, currentCategory, onCategoryFilter, allCategories }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    // Debounce the search input
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 300); // 300ms debounce
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(localSearchTerm);
  };

  return (
    <div className={styles.blogControls}>
      <form className={styles.searchBox} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search articles..."
          value={localSearchTerm}
          onChange={handleInputChange}
        />
        <Button type="submit" className={styles.searchButton}>Search</Button>
      </form>
      <div className={styles.filterTags}>
        {allCategories.map(category => (
          <Button
            key={category}
            className={`${styles.tagFilter} ${currentCategory === category ? styles.active : ''}`}
            onClick={() => onCategoryFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BlogControls;