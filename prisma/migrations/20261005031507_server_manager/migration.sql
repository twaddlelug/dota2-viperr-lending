-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "managerDiscordId" TEXT;

-- CreateIndex
CREATE INDEX "Server_managerDiscordId_idx" ON "Server"("managerDiscordId");
