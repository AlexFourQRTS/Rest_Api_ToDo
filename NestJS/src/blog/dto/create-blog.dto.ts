import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl, IsBoolean, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  blogName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  blogContent: string;

  @IsString()
  @IsOptional()
  blogImage?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  blogCategory?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  blogExcerpt: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  blogTags?: string[];

  @IsBoolean()
  @IsOptional()
  blogFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  canEdit?: boolean;

  @IsNumber()
  @IsOptional()
  readTime?: number;
}