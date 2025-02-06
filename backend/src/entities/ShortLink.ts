import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ShortLink {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  originalUrl!: string;

  @Column({ type: 'varchar',nullable: true, unique: true, length: 20 })
  alias!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt!: Date | null;

  @Column({ default: 0 })
  clickCount!: number;
}
