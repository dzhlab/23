import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { JudgePanelType } from '../types/score.types';
import { Performance } from './Performance.entity';
import { User } from './User.entity';

/**
 * Сущность оценки
 */
@Entity('scores')
@Index(['performanceId', 'judgeId', 'panelType'], { unique: true })
export class Score {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  performanceId!: string;

  @Column({ type: 'uuid' })
  judgeId!: string;

  @Column({
    type: 'enum',
    enum: JudgePanelType,
  })
  panelType!: JudgePanelType;

  @Column({ type: 'decimal', precision: 5, scale: 3 })
  score!: number;

  @Column({ type: 'decimal', precision: 5, scale: 3, default: 0 })
  deductions!: number;

  @Column({ type: 'decimal', precision: 5, scale: 3, default: 0 })
  neutralDeductions!: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => Performance, (performance) => performance.scores, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'performanceId' })
  performance?: Performance;

  @ManyToOne(() => User, (user) => user.scores)
  @JoinColumn({ name: 'judgeId' })
  judge?: User;
}
