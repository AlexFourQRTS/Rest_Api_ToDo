import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  commentContent: string;
}
