// src/api/blogApi.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL ;

export const getArticles = async (limit = 10, offset = 0, category = 'all', searchTerm = '') => {
    try {
        const response = await axios.get(`${API_URL}/blog`, {
            params: {
                limit,
                page: Math.floor(offset / limit) + 1,
                category: category !== 'all' ? category : undefined,
                search: searchTerm || undefined
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getArticleById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/blog/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addArticle = async (newArticle) => {
    try {
        const response = await axios.post(`${API_URL}/blog`, newArticle);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateArticle = async (id, updatedArticle) => {
    try {
        const response = await axios.patch(`${API_URL}/blog/${id}`, updatedArticle);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteArticle = async (id) => {
    try {
        await axios.delete(`${API_URL}/blog/${id}`);
        return { success: true };
    } catch (error) {
        throw error;
    }
};

export const blogApi = {
  getPosts: async () => {
    return [];
  },
  createPost: async (post) => {
    return { id: 1, ...post };
  },
  updatePost: async (id, post) => {
    return { id, ...post };
  },
  deletePost: async (id) => {
    return { success: true };
  },
  likePost: async (id) => {
    return { success: true };
  },
  unlikePost: async (id) => {
    return { success: true };
  },
  addComment: async (postId, comment) => {
    return { id: 1, postId, ...comment };
  },
  deleteComment: async (id) => {
    return { success: true };
  },
};