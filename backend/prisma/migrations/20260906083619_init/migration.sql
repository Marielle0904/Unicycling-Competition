-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verein" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verein_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserIsInVerein" (
    "user_id" INTEGER NOT NULL,
    "verein_id" INTEGER NOT NULL,

    CONSTRAINT "UserIsInVerein_pkey" PRIMARY KEY ("user_id","verein_id")
);

-- CreateTable
CREATE TABLE "Trainer" (
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Competition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Juror" (
    "user_id" INTEGER NOT NULL,
    "vereins_id" INTEGER NOT NULL,
    "t" BOOLEAN NOT NULL DEFAULT false,
    "p" BOOLEAN NOT NULL DEFAULT false,
    "a" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Juror_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Juryleitung" (
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Juryleitung_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserIsInVerein" ADD CONSTRAINT "UserIsInVerein_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIsInVerein" ADD CONSTRAINT "UserIsInVerein_verein_id_fkey" FOREIGN KEY ("verein_id") REFERENCES "Verein"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trainer" ADD CONSTRAINT "Trainer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Juror" ADD CONSTRAINT "Juror_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Juror" ADD CONSTRAINT "Juror_vereins_id_fkey" FOREIGN KEY ("vereins_id") REFERENCES "Verein"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Juryleitung" ADD CONSTRAINT "Juryleitung_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
