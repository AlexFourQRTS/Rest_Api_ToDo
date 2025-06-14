import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Blog from '../Blog';
import { blogApi } from '../../../api/blogApi';

// Mock the blogApi
jest.mock('../../../api/blogApi', () => ({
  blogApi: {
    getPosts: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    likePost: jest.fn(),
    unlikePost: jest.fn(),
    addComment: jest.fn(),
    deleteComment: jest.fn(),
  },
}));

// Mock the auth context
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'testuser' },
    isAuthenticated: true,
  }),
}));

const mockPosts = [
  {
    id: 1,
    title: 'Test Post 1',
    content: 'Test Content 1',
    author: { id: 1, username: 'testuser' },
    likes: 5,
    comments: [],
    created_at: '2024-03-20T10:00:00Z',
  },
  {
    id: 2,
    title: 'Test Post 2',
    content: 'Test Content 2',
    author: { id: 2, username: 'otheruser' },
    likes: 3,
    comments: [],
    created_at: '2024-03-20T11:00:00Z',
  },
];

describe('Blog Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    blogApi.getPosts.mockResolvedValue(mockPosts);
  });

  it('renders blog posts correctly', async () => {
    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });
  });

  it('handles post creation', async () => {
    const newPost = {
      title: 'New Post',
      content: 'New Content',
    };

    blogApi.createPost.mockResolvedValue({
      ...newPost,
      id: 3,
      author: { id: 1, username: 'testuser' },
      likes: 0,
      comments: [],
      created_at: '2024-03-20T12:00:00Z',
    });

    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );

    // Wait for initial posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    // Click create post button
    const createButton = screen.getByText('Створити пост');
    fireEvent.click(createButton);

    // Fill in the form
    const titleInput = screen.getByLabelText('Заголовок');
    const contentInput = screen.getByLabelText('Вміст');
    fireEvent.change(titleInput, { target: { value: newPost.title } });
    fireEvent.change(contentInput, { target: { value: newPost.content } });

    // Submit the form
    const submitButton = screen.getByText('Опублікувати');
    fireEvent.click(submitButton);

    // Verify API call
    await waitFor(() => {
      expect(blogApi.createPost).toHaveBeenCalledWith(newPost);
    });
  });

  it('handles post deletion', async () => {
    blogApi.deletePost.mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    // Click delete button for first post
    const deleteButton = screen.getByTestId('delete-post-1');
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByText('Видалити');
    fireEvent.click(confirmButton);

    // Verify API call
    await waitFor(() => {
      expect(blogApi.deletePost).toHaveBeenCalledWith(1);
    });
  });

  it('handles post liking', async () => {
    blogApi.likePost.mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    // Click like button
    const likeButton = screen.getByTestId('like-post-1');
    fireEvent.click(likeButton);

    // Verify API call
    await waitFor(() => {
      expect(blogApi.likePost).toHaveBeenCalledWith(1);
    });
  });

  it('handles comment addition', async () => {
    const newComment = {
      content: 'Test Comment',
    };

    blogApi.addComment.mockResolvedValue({
      id: 1,
      content: newComment.content,
      author: { id: 1, username: 'testuser' },
      created_at: '2024-03-20T12:00:00Z',
    });

    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    // Click comment button
    const commentButton = screen.getByTestId('comment-post-1');
    fireEvent.click(commentButton);

    // Fill in comment form
    const commentInput = screen.getByLabelText('Коментар');
    fireEvent.change(commentInput, { target: { value: newComment.content } });

    // Submit comment
    const submitButton = screen.getByText('Додати коментар');
    fireEvent.click(submitButton);

    // Verify API call
    await waitFor(() => {
      expect(blogApi.addComment).toHaveBeenCalledWith(1, newComment);
    });
  });

  it('handles error states', async () => {
    blogApi.getPosts.mockRejectedValue(new Error('Failed to fetch posts'));

    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Помилка завантаження постів')).toBeInTheDocument();
    });
  });
}); 