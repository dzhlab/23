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
import {
  CompetitionStatus,
  CompetitionType,
  CompetitionLevel,
} from '../types/competition.types';
import { Gender, Apparatus } from '../types/athlete.types';
import { User } from './User.entity';
import { Performance } from './Performance.entity';
import { JudgeAssignment } from './JudgeAssignment.entity';

/**
 * Сущность соревнования
 */
@Entity('competitions')
@Index(['startDate', 'endDate'])
@Index(['status'])
export class Competition {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: CompetitionType,
  })
  type!: CompetitionType;

  @Column({
    type: 'enum',
    enum: CompetitionLevel,
  })
  level!: CompetitionLevel;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender!: Gender;

  @Column({ type: 'simple-array', nullable: true })
  apparatus?: Apparatus[];

  @Column({ type: 'timestamp' })
  startDate!: Date;

  @Column({ type: 'timestamp' })
  endDate!: Date;

  @Column({ type: 'timestamp' })
  registrationDeadline!: Date;

  @Column({ type: 'varchar', length: 255 })
  location!: string;

  @Column({ type: 'varchar', length: 100 })
  country!: string;

  @Column({ type: 'varchar', length: 100 })
  city!: string;

  @Column({ type: 'varchar', length: 255 })
  venue!: string;

  @Column({ type: 'int', nullable: true })
  maxParticipants?: number;

  @Column({ type: 'int', nullable: true })
  minAge?: number;

  @Column({ type: 'int', nullable: true })
  maxAge?: number;

  @Column({
    type: 'enum',
    enum: CompetitionStatus,
    default: CompetitionStatus.DRAFT,
  })
  status!: CompetitionStatus;

  @Column({ type: 'uuid' })
  organizerId!: string;

  @Column({ type: 'uuid', nullable: true })
  chiefJudgeId?: string;

  @Column({ type: 'text', nullable: true })
  rules?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.organizedCompetitions)
  @JoinColumn({ name: 'organizerId' })
  organizer?: User;

  @ManyToOne(() => User, (user) => user.chiefJudgeCompetitions, { nullable: true })
  @JoinColumn({ name: 'chiefJudgeId' })
  chiefJudge?: User;

  @OneToMany(() => Performance, (performance) => performance.competition)
  performances?: Performance[];

  @OneToMany(() => JudgeAssignment, (assignment) => assignment.competition)
  judgeAssignments?: JudgeAssignment[];
}
