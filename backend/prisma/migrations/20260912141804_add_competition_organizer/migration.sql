/*
  Warnings:

  - Added the required column `verein_id` to the `Competition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "verein_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_verein_id_fkey" FOREIGN KEY ("verein_id") REFERENCES "Verein"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
