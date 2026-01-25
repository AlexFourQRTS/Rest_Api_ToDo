import AuthApi from './AuthApi';
import BlogApi from './BlogApi';
import FileApi from './FileApi';
import UserApi from './UserApi';

// 1. Собираем всё в один именованный объект
export const authApi = AuthApi;
export const blogApi = BlogApi;
export const fileApi = FileApi;
export const userApi = UserApi;

const api = {
  auth: AuthApi,
  blog: BlogApi,
  file: FileApi,
  user: UserApi
};

export default api;

