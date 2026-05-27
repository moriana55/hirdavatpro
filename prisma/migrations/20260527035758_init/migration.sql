-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "specs" JSONB NOT NULL DEFAULT '{}',
    "price_range" TEXT,
    "image_url" TEXT,
    "source_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparisons" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "product_a_id" TEXT NOT NULL,
    "product_b_id" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "verdict" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE UNIQUE INDEX "products_brand_model_key" ON "products"("brand", "model");

-- CreateIndex
CREATE UNIQUE INDEX "comparisons_slug_key" ON "comparisons"("slug");

-- CreateIndex
CREATE INDEX "comparisons_product_a_id_idx" ON "comparisons"("product_a_id");

-- CreateIndex
CREATE INDEX "comparisons_product_b_id_idx" ON "comparisons"("product_b_id");

-- AddForeignKey
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_product_a_id_fkey" FOREIGN KEY ("product_a_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_product_b_id_fkey" FOREIGN KEY ("product_b_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
