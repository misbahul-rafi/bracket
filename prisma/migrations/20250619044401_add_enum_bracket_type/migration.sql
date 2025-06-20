/*
  Warnings:

  - The values [UPPER,LOWER,GRAND_FINAL] on the enum `Match_bracket` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Match` MODIFY `bracket` ENUM('ROUND_OF_32', 'ROUND_OF_16', 'QUARTERFINAL', 'SEMIFINAL', 'FINAL', 'THIRD_PLACE') NULL;
