/*
  Warnings:

  - You are about to drop the column `soldout` on the `Shirt` table. All the data in the column will be lost.
  - Added the required column `condition` to the `Shirt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Shirt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Shirt` DROP COLUMN `soldout`,
    ADD COLUMN `condition` VARCHAR(191) NOT NULL,
    ADD COLUMN `line` VARCHAR(191) NULL,
    ADD COLUMN `size` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'available',
    ADD COLUMN `year` INTEGER NULL;
