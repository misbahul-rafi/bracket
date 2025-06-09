-- AlterTable
ALTER TABLE `League` ADD COLUMN `groupMatchFormat` ENUM('BO1', 'BO3', 'BO5', 'BO7') NOT NULL DEFAULT 'BO3';
