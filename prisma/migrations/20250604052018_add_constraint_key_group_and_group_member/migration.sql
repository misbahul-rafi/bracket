/*
  Warnings:

  - A unique constraint covering the columns `[groupId,teamId]` on the table `GroupMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `GroupMember_groupId_teamId_key` ON `GroupMember`(`groupId`, `teamId`);
