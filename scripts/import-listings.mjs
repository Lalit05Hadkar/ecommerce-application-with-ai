#!/usr/bin/env node
/**
 * Listings importer.
 *
 * Reads incoming/listings.csv, validates each row, optimizes images from
 * incoming/images/ into public/images/products/ with macOS `sips`
 * (max dimension 1400px, JPEG), and regenerates lib/generated-products.ts
 * wholesale. Idempotent: the output depends only on the CSV + images.
 *
 * Usage: npm run import-listings
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CSV_PATH = path.join(ROOT, "incoming", "listings.csv");
const IMAGES_DIR = path.join(ROOT, "incoming", "images");
const OUT_IMAGES_DIR = path.join(ROOT, "public", "images", "products");
const OUT_TS_PATH = path.join(ROOT, "lib", "generated-products.ts");
const DATA_TS_PATH = path.join(ROOT, "lib", "data.ts");

const MAX_DIM = 1400;
const PLACEHOLDER = "/images/placeholder.svg";
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"];

const HEADER = [
  "name",
  "category",
  "subcategory",
  "price",
  "compareAtPrice",
  "description",
  "sizes",
  "image1",
  "image2",
  "featured",
  "isNew",
  "trending",
];

// ——— Quote-aware CSV parser ———

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.length > 1 || row[0] !== "") rows.push(row);
  }
  return rows;
}

// ——— Helpers ———

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function baseProductIds() {
  try {
    const src = fs.readFileSync(DATA_TS_PATH, "utf8");
    return new Set([...src.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]));
  } catch {
    return new Set();
  }
}

function optimizeImage(filename, outName) {
  const src = path.join(IMAGES_DIR, filename);
  if (!filename || !fs.existsSync(src)) return null;
  fs.mkdirSync(OUT_IMAGES_DIR, { recursive: true });
  const out = path.join(OUT_IMAGES_DIR, outName);
  try {
    execFileSync(
      "sips",
      ["-s", "format", "jpeg", "-Z", String(MAX_DIM), src, "--out", out],
      { stdio: "pipe" }
    );
    return `/images/products/${outName}`;
  } catch (err) {
    console.warn(`  ! sips failed for ${filename}: ${err.message}`);
    return null;
  }
}

const yes = (v) => /^(yes|true|1)$/i.test((v ?? "").trim());

// ——— Main ———

if (!fs.existsSync(CSV_PATH)) {
  console.log(`No listings file found at incoming/listings.csv.

To import products:
  1. cp incoming/listings-template.csv incoming/listings.csv
  2. Fill in your rows (see incoming/README.md for the column reference)
  3. Drop photos into incoming/images/
  4. Run: npm run import-listings`);
  process.exit(0);
}

const rows = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));
const dataRows = rows.slice(1); // drop the header row
console.log(`Read ${dataRows.length} data row(s) from incoming/listings.csv`);

const usedIds = baseProductIds();
const products = [];

dataRows.forEach((cols, idx) => {
  const line = idx + 2; // header is line 1
  const rec = {};
  HEADER.forEach((key, i) => {
    rec[key] = (cols[i] ?? "").trim();
  });

  // Validation
  const problems = [];
  if (!rec.name) problems.push("name is required");
  if (!["women", "men"].includes(rec.category))
    problems.push(`category must be women|men (got "${rec.category}")`);
  if (!rec.subcategory) problems.push("subcategory is required");
  if (rec.price === "" || Number.isNaN(Number(rec.price)))
    problems.push(`price must be numeric (got "${rec.price}")`);
  if (!rec.image1) problems.push("image1 is required");
  if (rec.compareAtPrice && Number.isNaN(Number(rec.compareAtPrice)))
    problems.push(`compareAtPrice must be numeric (got "${rec.compareAtPrice}")`);

  if (problems.length > 0) {
    console.error(`✗ Row ${line} (${rec.name || "unnamed"}) skipped:`);
    problems.forEach((p) => console.error(`    - ${p}`));
    return;
  }

  // Slug + collision handling
  let id = slugify(rec.name);
  if (!id) id = `product-${line}`;
  let candidate = id;
  let n = 2;
  while (usedIds.has(candidate)) {
    candidate = `${id}-${n++}`;
  }
  id = candidate;
  usedIds.add(id);

  // Images
  let image1 = optimizeImage(rec.image1, `${id}-1.jpg`);
  if (!image1) {
    console.warn(`  ! Row ${line} (${rec.name}): image "${rec.image1}" not found — using placeholder`);
    image1 = PLACEHOLDER;
  }
  let image2 = rec.image2
    ? optimizeImage(rec.image2, `${id}-2.jpg`)
    : null;
  if (rec.image2 && !image2) {
    console.warn(`  ! Row ${line} (${rec.name}): image "${rec.image2}" not found — falling back to image1`);
  }
  if (!image2) image2 = image1;

  products.push({
    id,
    name: rec.name,
    category: rec.category,
    subcategory: rec.subcategory,
    price: Number(rec.price),
    compareAtPrice: rec.compareAtPrice ? Number(rec.compareAtPrice) : undefined,
    description: rec.description,
    sizes: rec.sizes
      ? rec.sizes.split("|").map((s) => s.trim()).filter(Boolean)
      : DEFAULT_SIZES,
    images: [image1, image2],
    featured: yes(rec.featured),
    isNew: yes(rec.isNew),
    trending: yes(rec.trending),
  });
  console.log(`✓ Row ${line}: ${rec.name} → ${id}`);
});

// Regenerate lib/generated-products.ts wholesale
const ts = `// GENERATED FILE — do not hand-edit; regenerated by \`npm run import-listings\`.
// To switch the shop to generated-only products, see the PRODUCTS export in lib/data.ts.
import type { Product } from "./types";

export const GENERATED_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(OUT_TS_PATH, ts);
console.log(
  `\nWrote ${products.length} product(s) to lib/generated-products.ts`
);
