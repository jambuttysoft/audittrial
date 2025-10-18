/*
  Warnings:

  - Added the required column `originalName` to the `digitized` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_digitized" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originalDocumentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "purchaseDate" DATETIME,
    "vendorName" TEXT,
    "vendorAbn" TEXT,
    "vendorAddress" TEXT,
    "documentType" TEXT,
    "receiptNumber" TEXT,
    "paymentType" TEXT,
    "amountExclTax" REAL,
    "taxAmount" REAL,
    "totalAmount" REAL,
    "expenseCategory" TEXT,
    "taxStatus" TEXT,
    "digitizedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "digitized_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "digitized_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_digitized" ("amountExclTax", "companyId", "createdAt", "digitizedAt", "documentType", "expenseCategory", "fileName", "filePath", "fileSize", "id", "mimeType", "originalDocumentId", "paymentType", "purchaseDate", "receiptNumber", "taxAmount", "taxStatus", "totalAmount", "updatedAt", "userId", "vendorAbn", "vendorAddress", "vendorName") SELECT "amountExclTax", "companyId", "createdAt", "digitizedAt", "documentType", "expenseCategory", "fileName", "filePath", "fileSize", "id", "mimeType", "originalDocumentId", "paymentType", "purchaseDate", "receiptNumber", "taxAmount", "taxStatus", "totalAmount", "updatedAt", "userId", "vendorAbn", "vendorAddress", "vendorName" FROM "digitized";
DROP TABLE "digitized";
ALTER TABLE "new_digitized" RENAME TO "digitized";
CREATE UNIQUE INDEX "digitized_originalDocumentId_key" ON "digitized"("originalDocumentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
