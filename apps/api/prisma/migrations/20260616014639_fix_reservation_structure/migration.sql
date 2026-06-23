/*
  Warnings:

  - You are about to drop the column `preOrders` on the `reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `preOrders`;

-- CreateTable
CREATE TABLE `ReservationItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reservationId` INTEGER NOT NULL,
    `menuItemId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ReservationItem` ADD CONSTRAINT `ReservationItem_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
