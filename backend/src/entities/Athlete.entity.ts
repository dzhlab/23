import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Gender, AthleteCategory } from '../types/athlete.types';
import { User } from './User.entity';
import { Performance } from './Performance.entity';

/**
 * Сущность спортсмена
 */
@Entity('athletes')
@Index(['userId'], { unique: true })
export class Athlete {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName?: string;

  @Column({ type: 'date' })
  dateOfBirth!: Date;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender!: Gender;

  @Column({ type: 'varchar', length: 100 })
  country!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  club?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  coachName?: string;

  @Column({
    type: 'enum',
    enum: AthleteCategory,
    default: AthleteCategory.JUNIOR,
  })
  category!: AthleteCategory;

  @Column({ type: 'varchar', length: 100, nullable: true })
  licenseNumber?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.athletes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @OneToMany(() => Performance, (performance) => performance.athlete)
  performances?: Performance[];
}
