/*
  Warnings:

  - A unique constraint covering the columns `[matchId,gameIndex]` on the table `GameResult` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `GameResult_matchId_gameIndex_key` ON `GameResult`(`matchId`, `gameIndex`);
