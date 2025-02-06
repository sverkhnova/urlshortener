import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ShortLink {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  originalUrl!: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    unique: true
  })
  alias!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => "NOW() + interval '1 days'", 
    nullable: false
  })
  expiresAt!: Date;

  @Column({ default: 0 })
  clickCount!: number;
}
