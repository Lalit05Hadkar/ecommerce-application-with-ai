# Importing listings

Drop new product listings here and they become part of the shop catalogue.

## Workflow

1. Copy `listings-template.csv` to `incoming/listings.csv`.
2. Fill in one row per product (see the column reference below).
3. Drop the product photos into `incoming/images/`.
4. Run `npm run import-listings`.

The script validates every row, optimizes the images into
`public/images/products/`, and regenerates `lib/generated-products.ts`.
Invalid rows are skipped with a clear console error — the run does not fail.

## Column reference (in order)

| Column         | Required | Notes                                                        |
| -------------- | -------- | ------------------------------------------------------------ |
| name           | yes      | Product display name. The id is auto-slugged from it.        |
| category       | yes      | `women` or `men`                                             |
| subcategory    | yes      | e.g. `Dresses`, `Shirts`                                     |
| price          | yes      | Number, e.g. `129` or `129.50`                                |
| compareAtPrice | no       | Number; shown struck-through when higher than price          |
| description    | no       | Free text                                                    |
| sizes          | no       | `\|`-separated, e.g. `XS\|S\|M\|L\|XL` (default XS,S,M,L,XL)   |
| image1         | yes      | Filename in `incoming/images/`                               |
| image2         | no       | Hover image filename; falls back to image1                   |
| featured       | no       | `yes`/`no` (default `no`)                                    |
| isNew          | no       | `yes`/`no` (default `no`)                                    |
| trending       | no       | `yes`/`no` (default `no`)                                    |

Fields containing commas or quotes can be wrapped in double quotes; escape a
literal quote by doubling it (`""`).

If an image file is missing, the row is still imported with a neutral
placeholder image and a warning is printed.
