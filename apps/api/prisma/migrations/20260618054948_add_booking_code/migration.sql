/*
  Warnings:

  - A unique constraint covering the columns `[bookingCode]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `bookingCode` VARCHAR(191) NOT NULL DEFAULT 'TEMP';

-- CreateIndex
CREATE UNIQUE INDEX `Reservation_bookingCode_key` ON `Reservation`(`bookingCode`);
