import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    Column,
  } from 'typeorm';
  import { ShortLink } from './ShortLink';
  
  @Entity()
  export class Analytics {
    @PrimaryGeneratedColumn()
    id!: number;
  
    // Связь с ShortLink
    @ManyToOne(() => ShortLink, { onDelete: 'CASCADE' })
    shortLink!: ShortLink;
  
    // Время, когда произошёл клик
    @CreateDateColumn()
    clickedAt!: Date;
  
    // IP-адрес при клике
    @Column({ type: 'varchar', length: 100, nullable: true })
    ip!: string | null;
  }
  