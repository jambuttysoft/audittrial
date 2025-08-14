-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "isOAuthUser" BOOLEAN NOT NULL DEFAULT false,
    "oauthProvider" TEXT,
    "oauthId" TEXT,
    "name" TEXT,
    "userType" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
    "phone" TEXT,
    "address" TEXT,
    "website" TEXT,
    "avatar" TEXT,
    "company" TEXT,
    "services" TEXT,
    "isVisibleToClients" BOOLEAN NOT NULL DEFAULT false,
    "acceptsJobOffers" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "xeroAccessToken" TEXT,
    "xeroRefreshToken" TEXT,
    "xeroTokenExpiry" DATETIME,
    "xeroTenantId" TEXT,
    "xeroTenantName" TEXT,
    "xeroConnectedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "website" TEXT,
    "abn" TEXT,
    "industry" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUEUE',
    "uploadDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedDate" DATETIME,
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
    "transactionDate" DATETIME,
    "vendor" TEXT,
    "abn" TEXT,
    "gstAmount" REAL,
    "description" TEXT,
    "paymentMethod" TEXT,
    "transactionStatus" TEXT,
    "receiptData" JSONB,
    "userId" TEXT NOT NULL,
    "companyId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "documents_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "digitized" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originalDocumentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "digitized_originalDocumentId_key" ON "digitized"("originalDocumentId");
