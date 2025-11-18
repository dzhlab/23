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
import { JudgeCategory } from '../types/judge.types';
import { Apparatus } from '../types/athlete.types';
import { Competition } from './Competition.entity';
import { User } from './User.entity';

/**
 * Сущность назначения судьи на соревнование
 */
@Entity('judge_assignments')
@Index(['competitionId', 'judgeId'])
export class JudgeAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  competitionId!: string;

  @Column({ type: 'uuid' })
  judgeId!: string;

  @Column({
    type: 'enum',
    enum: JudgePanelType,
  })
  panelType!: JudgePanelType;

  @Column({
    type: 'enum',
    enum: Apparatus,
    nullable: true,
  })
  apparatus?: Apparatus;

  @Column({
    type: 'enum',
    enum: JudgeCategory,
  })
  category!: JudgeCategory;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => Competition, (competition) => competition.judgeAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'competitionId' })
  competition?: Competition;

  @ManyToOne(() => User, (user) => user.judgeAssignments)
  @JoinColumn({ name: 'judgeId' })
  judge?: User;
}
