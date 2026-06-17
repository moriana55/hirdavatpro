-- CreateTable
CREATE TABLE "affiliate_clicks" (
    "id" TEXT NOT NULL,
    "product_id" TEXT,
    "slug" TEXT,
    "retailer" TEXT NOT NULL,
    "target_url" TEXT NOT NULL,
    "referrer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affiliate_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'comparison',
    "context" TEXT NOT NULL DEFAULT '',
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "affiliate_clicks_retailer_idx" ON "affiliate_clicks"("retailer");

-- CreateIndex
CREATE INDEX "affiliate_clicks_product_id_idx" ON "affiliate_clicks"("product_id");

-- CreateIndex
CREATE INDEX "affiliate_clicks_created_at_idx" ON "affiliate_clicks"("created_at");

-- CreateIndex
CREATE INDEX "leads_source_idx" ON "leads"("source");

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");
