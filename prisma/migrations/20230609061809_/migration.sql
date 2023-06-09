/*
  Warnings:

  - You are about to alter the column `amount` on the `Budget` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `balance` on the `Budget` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `amount` on the `BudgetItem` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Budget" ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "balance" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "BudgetItem" ALTER COLUMN "amount" SET DATA TYPE INTEGER;
