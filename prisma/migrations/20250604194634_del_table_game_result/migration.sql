/*
  Warnings:

  - You are about to drop the `GameResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `GameResult` DROP FOREIGN KEY `GameResult_matchId_fkey`;

-- DropForeignKey
ALTER TABLE `GameResult` DROP FOREIGN KEY `GameResult_winnerId_fkey`;

-- AlterTable
ALTER TABLE `Match` ADD COLUMN `AwayScore` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `homeScore` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `GameResult`;
