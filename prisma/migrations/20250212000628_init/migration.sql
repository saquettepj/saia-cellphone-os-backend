-- CreateTable
CREATE TABLE "systemConfig" (
    "id" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "termsUpdateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriptionAgreement" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "systemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "accountType" TEXT NOT NULL DEFAULT 'NORMAL',
    "CNPJ" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailConfirmationCode" INTEGER,
    "emailChecked" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "payId" TEXT,
    "payType" TEXT,
    "withNfe" BOOLEAN DEFAULT true,
    "payDate" TIMESTAMP(3),
    "termsDate" TIMESTAMP(3),
    "companyTerms" TEXT,
    "lists" TEXT[],
    "textMessage" TEXT NOT NULL DEFAULT '',
    "hasCost" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessToken" (
    "code" TEXT NOT NULL,
    "companyId" TEXT,
    "activatedAt" TIMESTAMP(3),

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "supplier" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CNPJ" TEXT NOT NULL,
    "CEP" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "clientId" TEXT,
    "companyId" TEXT,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfe_data" (
    "id" TEXT NOT NULL,
    "serializedCertificatePFX" TEXT NOT NULL,
    "certificatePasswordEncrypt" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "IE" TEXT NOT NULL,
    "IM" TEXT NOT NULL,
    "idCSC" TEXT NOT NULL,
    "CSC" TEXT NOT NULL,
    "lastNNF" TEXT NOT NULL,

    CONSTRAINT "nfe_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfce" (
    "chNFe" TEXT NOT NULL,
    "nProt" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "clientId" TEXT,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nfce_pkey" PRIMARY KEY ("chNFe")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "cEAN" TEXT,
    "NCM" TEXT,
    "companyId" TEXT NOT NULL,
    "supplierId" TEXT,
    "warrantyDays" INTEGER,
    "type" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "condition" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "localization" TEXT,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "clientId" TEXT,
    "employeeId" TEXT,
    "IMEI" TEXT,
    "number" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "payDate" TIMESTAMP(3),
    "closingDate" TIMESTAMP(3),
    "paymentMethod" TEXT NOT NULL,
    "firstDueDate" TIMESTAMP(3),
    "dueDate" INTEGER,
    "numberOfInstallments" INTEGER,
    "interest" DOUBLE PRECISION,
    "amountPaid" DOUBLE PRECISION,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "registeredProductPrice" DOUBLE PRECISION NOT NULL,
    "registeredProductCost" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "discount" DOUBLE PRECISION,
    "initialQuantity" INTEGER NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT,
    "employeeId" TEXT,
    "status" TEXT DEFAULT 'PENDING',
    "report" TEXT,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_CNPJ_key" ON "company"("CNPJ");

-- CreateIndex
CREATE UNIQUE INDEX "company_email_key" ON "company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AccessToken_companyId_key" ON "AccessToken"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_companyId_CNPJ_key" ON "supplier"("companyId", "CNPJ");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_companyId_email_key" ON "supplier"("companyId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_companyId_CPF_key" ON "employee"("companyId", "CPF");

-- CreateIndex
CREATE UNIQUE INDEX "client_companyId_CPF_key" ON "client"("companyId", "CPF");

-- CreateIndex
CREATE UNIQUE INDEX "client_companyId_email_key" ON "client"("companyId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "address_clientId_key" ON "address"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "address_companyId_key" ON "address"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "nfe_data_companyId_key" ON "nfe_data"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "nfce_chNFe_key" ON "nfce"("chNFe");

-- CreateIndex
CREATE UNIQUE INDEX "nfce_nProt_key" ON "nfce"("nProt");

-- CreateIndex
CREATE UNIQUE INDEX "nfce_orderId_key" ON "nfce"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "nfce_companyId_chNFe_key" ON "nfce"("companyId", "chNFe");

-- CreateIndex
CREATE UNIQUE INDEX "nfce_companyId_nProt_key" ON "nfce"("companyId", "nProt");

-- CreateIndex
CREATE UNIQUE INDEX "product_companyId_description_key" ON "product"("companyId", "description");

-- CreateIndex
CREATE UNIQUE INDEX "order_companyId_number_key" ON "order"("companyId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "service_orderItemId_key" ON "service"("orderItemId");

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier" ADD CONSTRAINT "supplier_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfe_data" ADD CONSTRAINT "nfe_data_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfce" ADD CONSTRAINT "nfce_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfce" ADD CONSTRAINT "nfce_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfce" ADD CONSTRAINT "nfce_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
