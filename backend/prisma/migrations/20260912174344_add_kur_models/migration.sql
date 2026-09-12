-- CreateTable
CREATE TABLE "Einzelkuer" (
    "id" SERIAL NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "verein_id" INTEGER NOT NULL,
    "titel" TEXT NOT NULL,
    "platzierung" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Einzelkuer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EinzelkuerFahrer" (
    "kuer_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "EinzelkuerFahrer_pkey" PRIMARY KEY ("kuer_id","user_id")
);

-- CreateTable
CREATE TABLE "Paarkuer" (
    "id" SERIAL NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "verein_id" INTEGER NOT NULL,
    "titel" TEXT NOT NULL,
    "platzierung" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paarkuer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaarkuerFahrer" (
    "kuer_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "PaarkuerFahrer_pkey" PRIMARY KEY ("kuer_id","user_id")
);

-- CreateTable
CREATE TABLE "Kleingruppenkuer" (
    "id" SERIAL NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "verein_id" INTEGER NOT NULL,
    "titel" TEXT NOT NULL,
    "fahrer_anzahl" INTEGER NOT NULL,
    "ersatzfahrer_anzahl" INTEGER NOT NULL,
    "platzierung" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kleingruppenkuer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KleingruppenkuerFahrer" (
    "kuer_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "KleingruppenkuerFahrer_pkey" PRIMARY KEY ("kuer_id","user_id")
);

-- CreateTable
CREATE TABLE "KleingruppenkuerErsatzfahrer" (
    "kuer_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "KleingruppenkuerErsatzfahrer_pkey" PRIMARY KEY ("kuer_id","user_id")
);

-- CreateTable
CREATE TABLE "Grossgruppenkuer" (
    "id" SERIAL NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "verein_id" INTEGER NOT NULL,
    "titel" TEXT NOT NULL,
    "fahrer_anzahl" INTEGER NOT NULL,
    "ersatzfahrer_anzahl" INTEGER NOT NULL,
    "platzierung" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grossgruppenkuer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrossgruppenkuerFahrer" (
    "kuer_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "GrossgruppenkuerFahrer_pkey" PRIMARY KEY ("kuer_id","user_id")
);

-- CreateTable
CREATE TABLE "GrossgruppenkuerErsatzfahrer" (
    "kuer_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "GrossgruppenkuerErsatzfahrer_pkey" PRIMARY KEY ("kuer_id","user_id")
);

-- AddForeignKey
ALTER TABLE "Einzelkuer" ADD CONSTRAINT "Einzelkuer_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Einzelkuer" ADD CONSTRAINT "Einzelkuer_verein_id_fkey" FOREIGN KEY ("verein_id") REFERENCES "Verein"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EinzelkuerFahrer" ADD CONSTRAINT "EinzelkuerFahrer_kuer_id_fkey" FOREIGN KEY ("kuer_id") REFERENCES "Einzelkuer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EinzelkuerFahrer" ADD CONSTRAINT "EinzelkuerFahrer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paarkuer" ADD CONSTRAINT "Paarkuer_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paarkuer" ADD CONSTRAINT "Paarkuer_verein_id_fkey" FOREIGN KEY ("verein_id") REFERENCES "Verein"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaarkuerFahrer" ADD CONSTRAINT "PaarkuerFahrer_kuer_id_fkey" FOREIGN KEY ("kuer_id") REFERENCES "Paarkuer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaarkuerFahrer" ADD CONSTRAINT "PaarkuerFahrer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kleingruppenkuer" ADD CONSTRAINT "Kleingruppenkuer_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kleingruppenkuer" ADD CONSTRAINT "Kleingruppenkuer_verein_id_fkey" FOREIGN KEY ("verein_id") REFERENCES "Verein"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KleingruppenkuerFahrer" ADD CONSTRAINT "KleingruppenkuerFahrer_kuer_id_fkey" FOREIGN KEY ("kuer_id") REFERENCES "Kleingruppenkuer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KleingruppenkuerFahrer" ADD CONSTRAINT "KleingruppenkuerFahrer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KleingruppenkuerErsatzfahrer" ADD CONSTRAINT "KleingruppenkuerErsatzfahrer_kuer_id_fkey" FOREIGN KEY ("kuer_id") REFERENCES "Kleingruppenkuer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KleingruppenkuerErsatzfahrer" ADD CONSTRAINT "KleingruppenkuerErsatzfahrer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grossgruppenkuer" ADD CONSTRAINT "Grossgruppenkuer_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grossgruppenkuer" ADD CONSTRAINT "Grossgruppenkuer_verein_id_fkey" FOREIGN KEY ("verein_id") REFERENCES "Verein"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrossgruppenkuerFahrer" ADD CONSTRAINT "GrossgruppenkuerFahrer_kuer_id_fkey" FOREIGN KEY ("kuer_id") REFERENCES "Grossgruppenkuer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrossgruppenkuerFahrer" ADD CONSTRAINT "GrossgruppenkuerFahrer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrossgruppenkuerErsatzfahrer" ADD CONSTRAINT "GrossgruppenkuerErsatzfahrer_kuer_id_fkey" FOREIGN KEY ("kuer_id") REFERENCES "Grossgruppenkuer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrossgruppenkuerErsatzfahrer" ADD CONSTRAINT "GrossgruppenkuerErsatzfahrer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
