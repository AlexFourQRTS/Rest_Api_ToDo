import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { IBlogQuery } from './interfaces';

import { Blog } from './entities/blog.entity';
import { CreateBlogDto, UpdateBlogDto } from './dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) { }

  async findAll(queryParams: IBlogQuery) {
    const { search, category, page = 1, limit = 10 } = queryParams;
    const skipCount = (page - 1) * limit;

    const whereClause: any = {};

    if (search) {
      whereClause.name = ILike(`%${search}%`);
    }

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    const [blogsList, totalCount] = await this.blogRepository.findAndCount({
      where: whereClause,
      skip: skipCount,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      articles: blogsList,
      totalCount: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findOne(blogId: string) {
    const blogData = await this.blogRepository.findOne({ where: { id: blogId } });

    if (!blogData) {
      throw new NotFoundException('Blog not found');
    }

    return blogData;
  }

  async update(blogId: string, updateBlogDto: UpdateBlogDto) {
    const blogData = await this.blogRepository.findOne({ where: { id: blogId } });

    if (!blogData) {
      throw new NotFoundException('Blog not found');
    }

    const updateData = {
      name: updateBlogDto.blogName,
      content: updateBlogDto.blogContent,
      image: updateBlogDto.blogImage,
      image_url: updateBlogDto.imageUrl,
      category: updateBlogDto.blogCategory,
      excerpt: updateBlogDto.blogExcerpt,
      tags: updateBlogDto.blogTags,
      featured: updateBlogDto.blogFeatured,
      canEdit: updateBlogDto.canEdit,
      readTime: updateBlogDto.readTime,
    };

    Object.assign(blogData, updateData);
    return await this.blogRepository.save(blogData);
  }

  async remove(blogId: string) {
    const blogData = await this.blogRepository.findOne({ where: { id: blogId } });

    if (!blogData) {
      throw new NotFoundException('Blog not found');
    }

    await this.blogRepository.remove(blogData);
    return { removeSuccess: true };
  }

  async create(createBlogDto: CreateBlogDto) {
    const blogData = this.blogRepository.create({
      name: createBlogDto.blogName,
      content: createBlogDto.blogContent,
      image: createBlogDto.blogImage || 'No',
      image_url: createBlogDto.imageUrl,
      category: createBlogDto.blogCategory,
      excerpt: createBlogDto.blogExcerpt,
      tags: createBlogDto.blogTags,
      featured: createBlogDto.blogFeatured || false,
      canEdit: createBlogDto.canEdit ?? true,
      readTime: createBlogDto.readTime || 5,
    });
    return await this.blogRepository.save(blogData);
  }
}
