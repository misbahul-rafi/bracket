/*
  Warnings:

  - A unique constraint covering the columns `[name,leagueId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Group_name_leagueId_key` ON `Group`(`name`, `leagueId`);
