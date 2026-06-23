-- AddForeignKey
ALTER TABLE `ReservationItem` ADD CONSTRAINT `ReservationItem_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `MenuItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
