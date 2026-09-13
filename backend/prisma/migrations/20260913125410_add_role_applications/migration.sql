-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('TRAINER', 'JUROR', 'JURYLEITUNG');

-- CreateEnum
CREATE TYPE "RoleApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "RoleApplication" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" "RoleType" NOT NULL,
    "status" "RoleApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "verein_id" INTEGER,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" INTEGER,

    CONSTRAINT "RoleApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoleApplication_user_id_idx" ON "RoleApplication"("user_id");

-- CreateIndex
CREATE INDEX "RoleApplication_status_idx" ON "RoleApplication"("status");

-- AddForeignKey
ALTER TABLE "RoleApplication" ADD CONSTRAINT "RoleApplication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleApplication" ADD CONSTRAINT "RoleApplication_verein_id_fkey" FOREIGN KEY ("verein_id") REFERENCES "Verein"("id") ON DELETE SET NULL ON UPDATE CASCADE;
