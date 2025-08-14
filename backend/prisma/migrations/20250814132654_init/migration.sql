-- CreateEnum
CREATE TYPE "public"."DocumentStatus" AS ENUM ('QUEUE', 'PROCESSING', 'DIGITIZED', 'ERROR');

-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('INDIVIDUAL', 'BUSINESS');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "isOAuthUser" BOOLEAN NOT NULL DEFAULT false,
    "oauthProvider" TEXT,
    "oauthId" TEXT,
    "name" TEXT,
    "userType" "public"."UserType" NOT NULL DEFAULT 'INDIVIDUAL',
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
    "xeroTokenExpiry" TIMESTAMP(3),
    "xeroTenantId" TEXT,
    "xeroTenantName" TEXT,
    "xeroConnectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "status" "public"."DocumentStatus" NOT NULL DEFAULT 'QUEUE',
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedDate" TIMESTAMP(3),
    "transactionDate" TIMESTAMP(3),
    "vendor" TEXT,
    "abn" TEXT,
    "totalAmount" DOUBLE PRECISION,
    "gstAmount" DOUBLE PRECISION,
    "description" TEXT,
    "paymentMethod" TEXT,
    "transactionStatus" TEXT,
    "documentType" TEXT,
    "receiptData" JSONB,
    "userId" TEXT NOT NULL,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
