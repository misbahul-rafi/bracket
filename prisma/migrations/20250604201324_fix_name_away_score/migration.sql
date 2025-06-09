/*
  Warnings:

  - You are about to drop the column `AwayScore` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Match` DROP COLUMN `AwayScore`,
    ADD COLUMN `awayScore` INTEGER NOT NULL DEFAULT 0;
