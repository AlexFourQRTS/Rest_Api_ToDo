export interface IBlog {
  blogId: string;
  blogTitle: string;
  blogContent: string;
  blogExcerpt: string;
  blogCategory: string;
  blogTags: string[];
  imageUrl: string;
  authorId: string;
  blogLikes: string[];
  blogDislikes: string[];
  blogComments: IComment[];
  blogViews: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  commentId: string;
  commentContent: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogCreate {
  blogTitle: string;
  blogContent: string;
  blogExcerpt: string;
  blogCategory: string;
  blogTags: string[];
  imageUrl?: string;
}

export interface IBlogUpdate extends Partial<IBlogCreate> {}

export interface IBlogQuery {
  search?: string;
  category?: string;
  queryTag?: string;
  page?: number;
  limit?: number;
}