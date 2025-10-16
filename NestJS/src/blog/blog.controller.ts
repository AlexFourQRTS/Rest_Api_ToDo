import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { IBlogQuery } from './interfaces';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async findAll(@Query() queryParams: IBlogQuery) {
    return this.blogService.findAll(queryParams);
  }

  @Get(':id')
  async findOne(@Param('id') blogId: string) {
    return this.blogService.findOne(blogId);
  }

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Patch(':id')
  async update(@Param('id') blogId: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(blogId, updateBlogDto);
  }

  @Delete(':id')
  async remove(@Param('id') blogId: string) {
    return this.blogService.remove(blogId);
  }
}