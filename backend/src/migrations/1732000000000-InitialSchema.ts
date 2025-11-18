import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1732000000000 implements MigrationInterface {
  name = 'InitialSchema1732000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(255) NOT NULL,
        "username" character varying(100) NOT NULL,
        "password" character varying(255) NOT NULL,
        "firstName" character varying(100) NOT NULL,
        "lastName" character varying(100) NOT NULL,
        "middleName" character varying(100),
        "dateOfBirth" date,
        "country" character varying(100),
        "city" character varying(100),
        "organization" character varying(255),
        "role" character varying NOT NULL DEFAULT 'spectator',
        "isBlocked" boolean NOT NULL DEFAULT false,
        "emailVerified" boolean NOT NULL DEFAULT false,
        "lastLoginAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_username" UNIQUE ("username")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_email" ON "users" ("email")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_username" ON "users" ("username")
    `);

    // Create athletes table
    await queryRunner.query(`
      CREATE TABLE "athletes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "firstName" character varying(100) NOT NULL,
        "lastName" character varying(100) NOT NULL,
        "middleName" character varying(100),
        "dateOfBirth" date NOT NULL,
        "gender" character varying NOT NULL,
        "country" character varying(100) NOT NULL,
        "city" character varying(100),
        "club" character varying(255),
        "coachName" character varying(255),
        "category" character varying NOT NULL DEFAULT 'junior',
        "licenseNumber" character varying(100),
        "nationality" character varying(100),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_athletes" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_athletes_userId" UNIQUE ("userId"),
        CONSTRAINT "FK_athletes_users" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_athletes_userId" ON "athletes" ("userId")
    `);

    // Create competitions table
    await queryRunner.query(`
      CREATE TABLE "competitions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "description" text,
        "type" character varying NOT NULL,
        "level" character varying NOT NULL,
        "gender" character varying NOT NULL,
        "apparatus" text,
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP NOT NULL,
        "registrationDeadline" TIMESTAMP NOT NULL,
        "location" character varying(255) NOT NULL,
        "country" character varying(100) NOT NULL,
        "city" character varying(100) NOT NULL,
        "venue" character varying(255) NOT NULL,
        "maxParticipants" integer,
        "minAge" integer,
        "maxAge" integer,
        "status" character varying NOT NULL DEFAULT 'draft',
        "organizerId" uuid NOT NULL,
        "chiefJudgeId" uuid,
        "rules" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_competitions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_competitions_organizer" FOREIGN KEY ("organizerId") REFERENCES "users"("id"),
        CONSTRAINT "FK_competitions_chiefJudge" FOREIGN KEY ("chiefJudgeId") REFERENCES "users"("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_competitions_startDate_endDate" ON "competitions" ("startDate", "endDate")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_competitions_status" ON "competitions" ("status")
    `);

    // Create performances table
    await queryRunner.query(`
      CREATE TABLE "performances" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "competitionId" uuid NOT NULL,
        "athleteId" uuid NOT NULL,
        "apparatus" character varying NOT NULL,
        "startTime" TIMESTAMP,
        "endTime" TIMESTAMP,
        "orderNumber" integer NOT NULL,
        "status" character varying NOT NULL DEFAULT 'scheduled',
        "videoUrl" character varying(500),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_performances" PRIMARY KEY ("id"),
        CONSTRAINT "FK_performances_competition" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_performances_athlete" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_performances_competitionId_athleteId" ON "performances" ("competitionId", "athleteId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_performances_status" ON "performances" ("status")
    `);

    // Create scores table
    await queryRunner.query(`
      CREATE TABLE "scores" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "performanceId" uuid NOT NULL,
        "judgeId" uuid NOT NULL,
        "panelType" character varying NOT NULL,
        "score" decimal(5,3) NOT NULL,
        "deductions" decimal(5,3) NOT NULL DEFAULT 0,
        "neutralDeductions" decimal(5,3) NOT NULL DEFAULT 0,
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_scores" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_scores_performance_judge_panel" UNIQUE ("performanceId", "judgeId", "panelType"),
        CONSTRAINT "FK_scores_performance" FOREIGN KEY ("performanceId") REFERENCES "performances"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_scores_judge" FOREIGN KEY ("judgeId") REFERENCES "users"("id")
      )
    `);

    // Create judge_assignments table
    await queryRunner.query(`
      CREATE TABLE "judge_assignments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "competitionId" uuid NOT NULL,
        "judgeId" uuid NOT NULL,
        "panelType" character varying NOT NULL,
        "apparatus" character varying,
        "category" character varying NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_judge_assignments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_judge_assignments_competition" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_judge_assignments_judge" FOREIGN KEY ("judgeId") REFERENCES "users"("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_judge_assignments_competitionId_judgeId" ON "judge_assignments" ("competitionId", "judgeId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_judge_assignments_competitionId_judgeId"`);
    await queryRunner.query(`DROP TABLE "judge_assignments"`);
    await queryRunner.query(`DROP INDEX "IDX_performances_status"`);
    await queryRunner.query(`DROP INDEX "IDX_performances_competitionId_athleteId"`);
    await queryRunner.query(`DROP TABLE "scores"`);
    await queryRunner.query(`DROP TABLE "performances"`);
    await queryRunner.query(`DROP INDEX "IDX_competitions_status"`);
    await queryRunner.query(`DROP INDEX "IDX_competitions_startDate_endDate"`);
    await queryRunner.query(`DROP TABLE "competitions"`);
    await queryRunner.query(`DROP INDEX "IDX_athletes_userId"`);
    await queryRunner.query(`DROP TABLE "athletes"`);
    await queryRunner.query(`DROP INDEX "IDX_users_username"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
