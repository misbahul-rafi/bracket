/*
  Warnings:

  - The values [GROUP_TO_KNOCKOUT] on the enum `Stage_format` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Stage` MODIFY `format` ENUM('SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN', 'SWISS', 'LADDER') NOT NULL;
