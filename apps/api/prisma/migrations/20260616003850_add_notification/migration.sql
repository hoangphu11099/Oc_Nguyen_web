/*
  Warnings:

  - The values [REVIEW] on the enum `Notification_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `notification` MODIFY `type` ENUM('SYSTEM', 'RESERVATION', 'PROMOTION') NOT NULL DEFAULT 'SYSTEM';
