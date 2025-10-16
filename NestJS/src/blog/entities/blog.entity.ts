import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Comment } from './comment.entity';

@Entity('blog_posts')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ type: 'text', nullable: true })
  category: string;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true, default: 'No' })
  image: string;

  @Column({ type: 'text', nullable: true })
  image_url: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  featured: boolean;

  @Column({ name: 'canedit', type: 'boolean', nullable: true, default: true })
  canEdit: boolean;

  @Column({ name: 'readtime', type: 'integer', nullable: true, default: 5 })
  readTime: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Comment, comment => comment.blog)
  comments: Comment[];
}



