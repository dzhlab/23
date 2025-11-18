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
import { PerformanceStatus } from '../types/performance.types';
import { Apparatus } from '../types/athlete.types';
import { Competition } from './Competition.entity';
import { Athlete } from './Athlete.entity';
import { Score } from './Score.entity';

/**
 * Сущность выступления
 */
@Entity('performances')
@Index(['competitionId', 'athleteId'])
@Index(['status'])
export class Performance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  competitionId!: string;

  @Column({ type: 'uuid' })
  athleteId!: string;

  @Column({
    type: 'enum',
    enum: Apparatus,
  })
  apparatus!: Apparatus;

  @Column({ type: 'timestamp', nullable: true })
  startTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime?: Date;

  @Column({ type: 'int' })
  orderNumber!: number;

  @Column({
    type: 'enum',
    enum: PerformanceStatus,
    default: PerformanceStatus.SCHEDULED,
  })
  status!: PerformanceStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  videoUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => Competition, (competition) => competition.performances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'competitionId' })
  competition?: Competition;

  @ManyToOne(() => Athlete, (athlete) => athlete.performances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'athleteId' })
  athlete?: Athlete;

  @OneToMany(() => Score, (score) => score.performance)
  scores?: Score[];
}
