import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn
} from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  filename: string;

  @Column({ name: 'original_name', nullable: false })
  original_name: string;

  @Column({ name: 'mime_type', nullable: false })
  mime_type: string;

  @Column({ nullable: false })
  path: string;

  @Column({ type: 'bigint', nullable: false })
  size: number;

  @Column({ name: 'file_type', nullable: false })
  file_type: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploaded_at: Date;
}

export default File;

