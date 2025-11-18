import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { UserRole } from '../types/user.types';
import { Athlete } from './Athlete.entity';
import { Competition } from './Competition.entity';
import { Score } from './Score.entity';
import { JudgeAssignment } from './JudgeAssignment.entity';

/**
 * Сущность пользователя
 */
@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password!: string;

  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  organization?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SPECTATOR,
  })
  role!: UserRole;

  @Column({ type: 'boolean', default: false })
  isBlocked!: boolean;

  @Column({ type: 'boolean', default: false })
  emailVerified!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @OneToMany(() => Athlete, (athlete) => athlete.user)
  athletes?: Athlete[];

  @OneToMany(() => Competition, (competition) => competition.organizer)
  organizedCompetitions?: Competition[];

  @OneToMany(() => Competition, (competition) => competition.chiefJudge)
  chiefJudgeCompetitions?: Competition[];

  @OneToMany(() => Score, (score) => score.judge)
  scores?: Score[];

  @OneToMany(() => JudgeAssignment, (assignment) => assignment.judge)
  judgeAssignments?: JudgeAssignment[];
}
