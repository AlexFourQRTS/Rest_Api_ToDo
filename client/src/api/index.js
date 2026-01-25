import AuthApi from './AuthApi_fix';
import BlogApi from './BlogApi_fix';
import FileApi from './FileApi_fix';
import UserApi from './UserApi_fix';

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

