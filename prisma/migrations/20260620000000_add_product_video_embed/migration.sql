-- Product modeline opsiyonel video/embed alanları (additive, nullable).
-- Feature: YouTube/Instagram inceleme embed'i.
ALTER TABLE "products" ADD COLUMN "youtube_url" TEXT;
ALTER TABLE "products" ADD COLUMN "instagram_url" TEXT;
