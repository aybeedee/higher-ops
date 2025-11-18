/*
  Warnings:

  - You are about to drop the `Operation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Operation" DROP CONSTRAINT "Operation_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Operation" DROP CONSTRAINT "Operation_userId_fkey";

-- DropTable
DROP TABLE "Operation";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operations" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "op" "OperationType",
    "right_value" DOUBLE PRECISION,
    "value" DOUBLE PRECISION NOT NULL,
    "path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "operations_path_idx" ON "operations"("path");

-- CreateIndex
CREATE INDEX "operations_parent_id_idx" ON "operations"("parent_id");

-- CreateIndex
CREATE INDEX "operations_user_id_idx" ON "operations"("user_id");

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "operations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
