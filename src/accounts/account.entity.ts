import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  type: string;

  @Column({ type: 'double' })
  startValue: number;

  @Column({ type: 'double' })
  currentValue: number;

  @Column({
    default: 'pln',
  })
  currency: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: number;
}
