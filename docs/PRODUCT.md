# Product module guide

This document explains how products work end-to-end in the tenant admin: the create/edit flow, what each field is for, and how related catalog modules connect.

---

## Core concepts

### Product vs variant

| Layer | What it is | Examples |
|-------|------------|----------|
| **Product** | Catalog parent — marketing, organization, media, SEO, type-specific config | Name, description, categories, gallery |
| **Variant** | Sellable SKU — price, barcode, inventory, shipping dimensions | `SKU-RED-L`, price `$29.99`, stock in Warehouse A |

Every product has at least one variant. For **simple**, **digital**, **bundle**, **service**, and **subscription** types, you manage a **default variant** on the main form. For **variable** and **configurable** types, you define **options** (e.g. Size, Color) and create **multiple variants** after the product is saved.

### Product types

| Type | Pricing on main form | Variants / options | Extra sections (after save) |
|------|---------------------|--------------------|-----------------------------|
| **Simple** | Yes (default variant) | Single default variant | Suppliers, related products |
| **Variable** | No — per variant | Options + generated/manual variants | Options, variants, suppliers, relations |
| **Configurable** | No — per variant | Same as variable | Same as variable |
| **Digital** | Yes | Default variant | Downloads, suppliers, relations |
| **Bundle** | Yes | Default variant | Bundle items, suppliers, relations |
| **Service** | Yes | Default variant | Service config + providers, relations |
| **Subscription** | Yes | Default variant | Subscription billing config, relations |
| **Gift card** | Backend supported | Default variant | UI parity may vary |

Type controls which form sections appear and whether inventory/shipping behavior applies (see backend `ProductType` enum).

---

## End-to-end admin process

### 1. Prepare catalog data (optional but recommended)

Before creating products, set up supporting data from the sidebar:

- **Categories** — navigation and filtering
- **Brands** — manufacturer / line
- **Tags** — flexible keywords
- **Product labels** — storefront badges (e.g. “New”, “Sale”)
- **Collections** — curated groups
- **Attribute sets** + **Attributes** — specifications (size chart, material, color)
- **Media** — images and downloadable files
- **Warehouses** — stock locations
- **Tax classes** — if products are taxable
- **Suppliers** — for procurement (edit product only)
- **Units** — weight/length units for variants (see [Units module](#units-module) below)

You can also quick-create categories, brands, tags, labels, and collections from the product form **Organization** section; new items are selected automatically.

### 2. Create a product

**Path:** `/admin/products` → **Create** → `/admin/products/new`

1. Fill **Basic information** (name, type, description).
2. Set **Publishing** (status, visibility, featured, publish date).
3. Set **Organization** (categories, brand, tags, labels, collections).
4. For non-variable types: set **Pricing** and **Inventory** on the default variant.
5. Add **Specifications** (attribute set values) if needed.
6. Add **Media** (primary image + gallery).
7. Configure **SEO** if needed.
8. Click **Create product** or **Save and continue** (stays on edit page).

On create, the API stores the product and its default variant (when the type requires pricing).

### 3. Edit-only configuration

After the product exists (`/admin/products/{id}/edit`), additional sections load based on type:

| Section | Purpose |
|---------|---------|
| **Suppliers** | Link vendors, costs, lead times |
| **Related products** | Related, cross-sell, upsell links |
| **Downloads** | Digital files (digital type) |
| **Bundle items** | Included products (bundle type) |
| **Service** | Duration, location, providers (service type) |
| **Subscription** | Billing interval, trial (subscription type) |
| **Options** | Variant axes e.g. Size, Color (variable/configurable) |
| **Variants** | SKU list, generate from options, price tiers, stock per variant |

Variable products workflow:

1. Save product with type **Variable**.
2. Open **Options** → define option names and values (e.g. Size: S, M, L).
3. Open **Variants** → **Generate** (all combinations) or **Add variant** manually.
4. Per variant: set price, inventory (tooltips: price tiers, inventory, edit, delete).

### 4. List management

**Path:** `/admin/products`

- Filter, sort, bulk **status** / **visibility** updates
- **View** dialog — summary with gallery and related products
- **Import** / **Export**
- Row actions: view, edit, **duplicate**, **manage FAQs**, **manage reviews**, **manage questions**, delete

**Duplicate** creates a draft copy named `{original} (Copy)` with hidden visibility, copies catalog data (images, videos, FAQs, documents, attribute values, default variant SKU with `-COPY` suffix). Does not copy reviews, customer questions, or product relations.

---

## Form sections and fields

### Shipping & dimensions (non-variable types)

On the main form for simple/digital/bundle/service/subscription products:

| Field | Purpose |
|-------|---------|
| **Weight** | Shipping weight on default variant |
| **Weight unit** | From Units module (kg, lb, …) |
| **Length / width / height** | Package dimensions |
| **Dimension unit** | From Units module (cm, in, …) |

Variable products set weight/dimensions per variant in the **variant edit** dialog (includes media picker for variant image).

### Videos

Add YouTube/Vimeo or direct video URLs on create or edit. Saved with the product payload or via `PUT /products/{id}/videos`.

### Documents (edit only)

PDFs, manuals, spec sheets — separate from digital **downloads**. Managed via nested API (`/products/{id}/documents`) in the **Documents** section on the edit form.

### Basic information

| Field | Required | Purpose |
|-------|----------|---------|
| **Name** | Yes | Display title on storefront and admin |
| **Slug** | Auto | URL segment; auto-generated from name until you edit it manually |
| **Subtitle** | No | Short tagline under the name |
| **Product type** | Yes | Controls variants, inventory, and extra sections (see table above) |
| **Condition** | Yes | new / refurbished / used / open_box / damaged |
| **Summary** | No | Brief text for listings and cards |
| **Description** | No | Full detail page content (rich text editor) |

### Publishing (sidebar)

| Field | Purpose |
|-------|---------|
| **Status** | `draft` — not live; `active` — sellable when published; `archived` — hidden from normal workflows |
| **Visibility** | `visible` — everywhere; `hidden` — not shown; `catalog` / `search` — limited surfaces |
| **Featured** | Highlight on homepage or featured lists |
| **Published at** | Schedule or backdate availability |

### Organization (sidebar)

| Field | Purpose |
|-------|---------|
| **Categories** | One or many; used for navigation and filters |
| **Primary category** | Main breadcrumb / canonical category (must be one of selected categories) |
| **Brand** | Single brand association |
| **Tags** | Many-to-many keywords for search/filter |
| **Product labels** | Storefront badges (e.g. “Bestseller”) |
| **Collections** | Manual or rule-based product groups |

Quick-add buttons open create dialogs and refresh options without leaving the form.

### Pricing (simple / digital / bundle / service / subscription)

Applies to the **default variant**.

| Field | Purpose |
|-------|---------|
| **SKU** | Unique stock-keeping identifier |
| **Variant title** | Label for the default SKU (often same as product name) |
| **Selling price** | Customer-facing price |
| **Compare-at price** | “Was” price for sale display |
| **Cost price** | Internal margin / COGS |
| **Barcode** | Scannable barcode (UPC/EAN etc.) |
| **Charge tax** | Whether tax rules apply |
| **Tax class** | Which tax rates apply when taxable |
| **Price tiers** | Quantity-based or customer-group pricing breaks |

### Inventory (non-variable types)

| Field | Purpose |
|-------|---------|
| **Track inventory** | Enable stock tracking for this product |
| **Allow backorders** | Sell when quantity is 0 |
| **Warehouse** | Default stock location |
| **Quantity** | On-hand amount for default variant |
| **Low stock threshold** | Reorder / alert level |
| **Manage stock** | (Edit only) Adjust or transfer stock across warehouses |

### Specifications (attributes)

| Field | Purpose |
|-------|---------|
| **Attribute set** | Template of spec fields (e.g. “Apparel specs”) |
| **Per-attribute values** | Filled based on attribute type: text, number, select, color swatch, color picker, textarea, boolean |

Color attributes with **swatch** display show clickable swatches; other color attributes show swatches (if predefined) plus a **color picker** for custom hex values.

### Media

| Field | Purpose |
|-------|---------|
| **Primary image** | Main listing and PDP image |
| **Gallery** | Additional images in a responsive grid; add via media library |

### Search engine listing (SEO)

| Field | Purpose |
|-------|---------|
| **Meta title** | `<title>` and search snippet headline |
| **Meta description** | Search snippet body |
| **Meta keywords** | Legacy / internal keywords |
| **Canonical URL** | Preferred URL for duplicates |
| **Open Graph** | Social share title, description, image |
| **Twitter card** | Twitter-specific share format |
| **Robots meta** | index/noindex, follow/nofollow |

### Suppliers (edit only)

| Field | Purpose |
|-------|---------|
| **Supplier** | Vendor record |
| **Supplier SKU / cost** | Procurement reference |
| **Lead time / minimum qty** | Replenishment planning |
| **Primary** | Default supplier for reorder |

### Related products (edit only)

| Relation type | Purpose |
|---------------|---------|
| **Related** | “Similar items” on product page |
| **Cross-sell** | Add-ons in cart / checkout |
| **Upsell** | Higher-value alternatives |

Saved separately via **Save relations**; previews show product images in a grid.

### Downloads (digital, edit only)

Attach media files with optional download limits and expiry.

### Bundle items (bundle, edit only)

| Field | Purpose |
|-------|---------|
| **Included product** | Component SKU |
| **Quantity** | How many per bundle |
| **Optional / discount / fixed price** | Bundle pricing rules |

### Service (service, edit only)

Duration, buffers, location type, meeting URL, providers, cancellation rules, and **availability schedule** (weekly booking windows per day/time, optional provider). Schedules are stored in `product_service_schedules` and used by the storefront booking flow.

### Customer content (row actions, edit permission)

| Feature | Who creates | Admin action |
|---------|-------------|--------------|
| **FAQs** | Admin (curated) | Manage FAQs dialog — CRUD like supplier contacts |
| **Reviews** | Customers | Manage reviews — approve, reply, delete |
| **Questions** | Customers | Manage questions — answer, delete |

### Subscription (subscription, edit only)

Billing interval, trial, proration, pause/cancel rules.

### Options & variants (variable / configurable, edit only)

**Options:** name + values (e.g. Color → Red, Blue).

**Variants:** each row is a sellable SKU with its own price, stock, and option combination. Actions:

- **Layers** — price tiers for that variant
- **Package** — inventory per warehouse
- **Edit** — variant fields
- **Trash** — remove variant

---

## Related modules

| Module | Used in products? | How |
|--------|-------------------|-----|
| Categories | Yes | Organization, primary category |
| Brands | Yes | Organization |
| Tags | Yes | Organization |
| Product labels | Yes | Organization + admin CRUD at `/admin/product-labels` |
| Collections | Yes | Organization |
| Attribute sets / Attributes | Yes | Specifications |
| Media | Yes | Primary image, gallery, downloads, documents, SEO images, variant images |
| Warehouses | Yes | Default variant + variant inventory |
| Tax classes | Yes | Taxable products |
| Suppliers | Yes | Edit-only supplier assignments |
| Units | **Partial** | See below |
| Customers / groups | Indirect | Price tiers can target customer groups |

---

## Units module

### Is it used by products?

**Yes.** Each **product variant** can store weight and dimensions with unit foreign keys:

| Variant field | Unit link |
|---------------|-----------|
| `weight` | `weight_unit_id` → `units` table |
| `length`, `width`, `height` | `dimension_unit_id` → `units` table |

The admin product form exposes these in **Shipping & dimensions** (default variant) and in the **variant edit** dialog.

**Note:** `ProductSpecification` also has a free-text `unit` column — display string on a spec row, not a FK to Units.

---

## Attribute values (catalog)

The **Attributes** module defines attributes and their predefined **attribute values** (e.g. Color → Red, Blue). Products do not link to `attribute_values` directly; they use an **attribute set** on the product form. Selected values are stored as `product_attribute_values` (with optional `custom_value` for free-text types).

---

## Cost history

When a variant **cost price** changes via `PUT /products/{id}/variants/{variant}`, the API logs a row in `product_cost_histories` (previous cost, new cost, user, timestamp). There is no admin UI to view history yet; data is available for reporting/margin tools.

---

## Service schedules

`product_service_schedules` defines when a **service** product can be booked (day of week, start/end time, optional provider, available flag). Configure in **Service configuration → Availability schedule** on the edit form. Customer-facing booking will read these windows; admin defines the rules.

---

## API overview (tenant)

Base path: `/api/tenant/products` (authenticated tenant context).

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/products` | Paginated list |
| POST | `/products` | Create product + default variant |
| GET | `/products/{id}` | Full detail (relations, variants, etc.) |
| PUT/PATCH | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Soft delete |
| PATCH | `/products/bulk` | Bulk status / visibility |
| GET | `/products/options` | Select options (with `image_url`) |
| PUT | `/products/{id}/options` | Sync variant options |
| POST | `/products/{id}/variants` | Create variant |
| POST | `/products/{id}/variants/generate` | Generate from options |
| PUT | `/products/{id}/variants/{variant}` | Update variant (includes unit IDs) |
| PUT | `/products/{id}/relations` | Sync related / cross-sell / upsell |
| PUT | `/products/{id}/suppliers` | Sync suppliers |
| PUT | `/products/{id}/downloads` | Sync digital downloads |
| PUT | `/products/{id}/bundle-items` | Sync bundle |
| PUT | `/products/{id}/service` | Sync service config, providers, schedules |
| PUT | `/products/{id}/subscription` | Sync subscription config |
| POST | `/products/{id}/duplicate` | Duplicate product as draft |
| GET/POST/PUT/DELETE | `/products/{id}/faqs` | Curated FAQ CRUD |
| GET/POST/PUT/DELETE | `/products/{id}/documents` | Product documents CRUD |
| GET/PUT/DELETE | `/products/{id}/reviews` | Moderate customer reviews |
| GET/PUT/DELETE | `/products/{id}/questions` | Answer customer questions |
| PUT | `/products/{id}/videos` | Sync product videos |

Inventory adjustments: `POST /inventories/{id}/adjust` and `/transfer`.

---

## File references (frontend)

| Area | Location |
|------|----------|
| Product form | `components/tenant/admin/components/products/product-form.tsx` |
| Nested dialogs | `products-manage-faqs-dialog.tsx`, `products-manage-reviews-dialog.tsx`, `products-manage-questions-dialog.tsx` |
| Form schema & defaults | `schemas/tenant/product-schema.ts`, `schemas/tenant/product-nested-schema.ts` |
| Nested hooks | `hooks/tenant/use-product-nested-query.ts` |
| API client | `lib/services/tenant/product-service.ts` |
| Types | `types/tenant/product.ts` |
| List page | `app/(tenant)/admin/(main)/products/page.tsx` |
| New / edit pages | `app/(tenant)/admin/(main)/products/new`, `.../[id]/edit` |

---

## Permissions

Product actions require tenant permissions such as `products.view`, `products.create`, `products.update`, `products.delete`. Product labels use `product-labels.*`. Re-seed `TenantRolePermissionSeeder` on the API if a module is missing from the sidebar or returns 403.

---

## Quick checklist: first product

1. Create category, brand, and upload media.
2. **Add product** → type **Simple**.
3. Set status **Active**, visibility **Visible**.
4. Assign category and primary image.
5. Enter SKU, price, warehouse quantity.
6. **Create product** → verify on list → **View** dialog.
7. For variable products: save first, then options → generate variants → set per-variant stock.
