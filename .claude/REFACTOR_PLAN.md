# Refactor Plan: Feature-Based Structure

**Goal:** Reorganize `src/` into a feature-based layout before adding new features.  
**Status:** Plan only — execute when you're ready.

---

## 1. Target Structure (Summary)

```
src/
├── features/
│   ├── products/
│   │   ├── api.ts
│   │   ├── schemas.ts
│   │   ├── hooks.ts
│   │   ├── types.ts
│   │   └── components/
│   │       ├── AddProductForm.tsx
│   │       ├── ProductPriceForm.tsx
│   │       ├── RemoveProductDialog.tsx
│   │       ├── ProductCard.tsx
│   │       ├── EmptyProduct.tsx
│   │       └── ProductPriceTable.tsx
│   │
│   ├── farmers/
│   │   ├── api.ts
│   │   ├── schemas.ts
│   │   ├── hooks.ts
│   │   └── components/
│   │       └── FarmerSelect.tsx
│   │
│   └── transactions/
│       ├── api.ts
│       ├── schemas.ts
│       ├── hooks.ts
│       └── components/
│           └── TransactionForm.tsx
│
├── routes/
│   ├── product.tsx
│   ├── farmer.tsx          # NEW
│   └── transaction.tsx
│
├── utils/
│   ├── currency.ts         # NEW: formatCurrency(), parseCurrency()
│   └── date.ts             # KEEP; add formatDate(), getThaiDate() if needed
│
└── (unchanged)
    ├── components/         # shared: nav-bar, ui/, storybook/, etc.
    ├── db/
    ├── integrations/
    ├── lib/
    ├── router.tsx
    ├── routeTree.gen.ts    # auto-generated from routes/
    ├── env.ts
    ├── styles.css
    └── logo.svg
```

---

## 2. Current → New File Mapping

### 2.1 Products

| Current path | Action | New path |
|-------------|--------|----------|
| `src/utils/productUtils.ts` | **Split** | See 2.1.1 below |
| `src/components/products/addProductForm.tsx` | **Move** | `src/features/products/components/AddProductForm.tsx` |
| `src/components/products/product-price/addProductPriceForm.tsx` | **Move** | `src/features/products/components/ProductPriceForm.tsx` |
| `src/components/products/removeProductDialog.tsx` | **Move** | `src/features/products/components/RemoveProductDialog.tsx` |
| `src/components/products/productCard.tsx` | **Move** | `src/features/products/components/ProductCard.tsx` |
| `src/components/products/emptyProduct.tsx` | **Move** | `src/features/products/components/EmptyProduct.tsx` |
| `src/components/products/product-price/productPriceTable.tsx` | **Move** | `src/features/products/components/ProductPriceTable.tsx` |

#### 2.1.1 Split `productUtils.ts` into:

| New file | Contents (from productUtils.ts) |
|----------|--------------------------------|
| `features/products/api.ts` | `fetchProduct`, `fetchProductPriceById`, `addProductDB`, `addProductPriceDB`, `deleteProductDB` (server fns + db/eq/z) |
| `features/products/schemas.ts` | `formProductSchema`, `formProductPrice` |
| `features/products/hooks.ts` | `useAddProduct`, `useAddProductPrice`, `useDeleteProduct` |
| `features/products/types.ts` | `FormProductType` (z.infer of formProductSchema) + any Product/ProductPrice types used by components if desired |

---

### 2.2 Farmers

| Item | Action | Notes |
|------|--------|-------|
| `features/farmers/api.ts` | **Create** | `fetchFarmer`, `addFarmerDB` (and any other farmer server fns; use `@/db`, `farmers` from schema) |
| `features/farmers/schemas.ts` | **Create** | `farmerSchema` (Zod) |
| `features/farmers/hooks.ts` | **Create** | `useAddFarmer` (and `useFarmers` if you have fetchFarmer) |
| `features/farmers/components/FarmerSelect.tsx` | **Create** | Stub or minimal select using farmers API/hooks |

*No existing farmer UI; DB has `farmers` in `db/schema.ts` and `db/relations.ts`.*

---

### 2.3 Transactions

| Current path | Action | New path |
|-------------|--------|----------|
| `src/components/transactions/transactionForm.tsx` | **Move** | `src/features/transactions/components/TransactionForm.tsx` |

| New file | Action | Notes |
|----------|--------|-------|
| `features/transactions/api.ts` | **Create** | Transaction-related server fns when they exist; can be stub/empty for now |
| `features/transactions/schemas.ts` | **Create** | Transaction form/validation schemas; stub if none yet |
| `features/transactions/hooks.ts` | **Create** | e.g. `useCreateTransaction`; stub if none yet |

*`TransactionForm` is currently a minimal stub.*

---

### 2.4 Utils

| Current path | Action | New path / content |
|-------------|--------|--------------------|
| `src/utils/date.ts` | **Keep** | `src/utils/date.ts`. Optionally add `formatDate`, `getThaiDate` and have them wrap or replace `transformDateThai` for consistency. |
| — | **Create** | `src/utils/currency.ts`: `formatCurrency(value: number): string`, `parseCurrency(input: string): number` |

---

### 2.5 Routes

| File | Action | Notes |
|------|--------|-------|
| `src/routes/product.tsx` | **Edit** | Update imports: `AddProductForm`, `EmptyProduct`, `ProductCard`, `fetchProduct` from `@/features/products/...` |
| `src/routes/transaction.tsx` | **Edit** | Import `TransactionForm` from `@/features/transactions/components/TransactionForm` |
| `src/routes/farmer.tsx` | **Create** | New route file; minimal page. `routeTree.gen.ts` will pick it up from `routes/` |

---

## 3. Import Updates (Checklist)

After moving/splitting, update imports in:

| File | Old import (example) | New import (example) |
|------|----------------------|----------------------|
| `AddProductForm` | `@/utils/productUtils` (formProductSchema, useAddProduct) | `@/features/products/schemas`, `@/features/products/hooks` |
| `ProductPriceForm` | `@/utils/productUtils` (fetchProductPriceById, formProductPrice, useAddProductPrice) | `@/features/products/api`, `@/features/products/schemas`, `@/features/products/hooks` |
| `RemoveProductDialog` | `@/utils/productUtils` (useDeleteProduct) | `@/features/products/hooks` |
| `ProductCard` | `@/utils/date` (transformDateThai), `./product-price/addProductPriceForm`, `./product-price/productPriceTable`, `./removeProductDialog` | `@/utils/date`, `./ProductPriceForm`, `./ProductPriceTable`, `./RemoveProductDialog` |
| `ProductPriceTable` | (none external) | — |
| `EmptyProduct` | `@/components/ui/empty`, `@tabler/icons-react` | Unchanged (keep `@/components/ui/empty`) |
| `TransactionForm` | (minimal) | — |
| `routes/product.tsx` | `@/components/products/...`, `@/utils/productUtils` | `@/features/products/components/...`, `@/features/products/api` |

- UI components: keep `@/components/ui/...` (and `@/components/nav-bar` etc.).
- DB: `@/db`, `@/db/schema` — no change.
- Utils: `@/utils/date`, `@/utils/currency` (new)`.

---

## 4. Execution Order

Do in this order to avoid broken imports during the refactor.

### Phase A: Create new structure (no deletions yet)

1. Create directories:
   - `src/features/products/`, `src/features/products/components/`
   - `src/features/farmers/`, `src/features/farmers/components/`
   - `src/features/transactions/`, `src/features/transactions/components/`

2. **Products – split productUtils:**
   - `features/products/schemas.ts` (formProductSchema, formProductPrice)
   - `features/products/types.ts` (FormProductType; re-export from schemas if preferred)
   - `features/products/api.ts` (fetchProduct, fetchProductPriceById, addProductDB, addProductPriceDB, deleteProductDB) — import schemas from `./schemas`, `z` for extra validators
   - `features/products/hooks.ts` (useAddProduct, useAddProductPrice, useDeleteProduct) — import api from `./api`

3. **Products – move components:**
   - `addProductForm.tsx` → `AddProductForm.tsx`, update imports to features
   - `addProductPriceForm.tsx` → `ProductPriceForm.tsx`, update imports
   - `removeProductDialog.tsx` → `RemoveProductDialog.tsx`, update imports
   - `productCard.tsx` → `ProductCard.tsx`, update internal paths (ProductPriceForm, ProductPriceTable, RemoveProductDialog) and `@/utils/date`
   - `emptyProduct.tsx` → `EmptyProduct.tsx`
   - `productPriceTable.tsx` → `ProductPriceTable.tsx`

4. **Farmers – create:**
   - `features/farmers/schemas.ts` (farmerSchema)
   - `features/farmers/api.ts` (fetchFarmer, addFarmerDB)
   - `features/farmers/hooks.ts` (useAddFarmer, optionally useFarmers)
   - `features/farmers/components/FarmerSelect.tsx` (stub or minimal)

5. **Transactions – create + move:**
   - `features/transactions/api.ts` (stub)
   - `features/transactions/schemas.ts` (stub)
   - `features/transactions/hooks.ts` (stub)
   - Move `transactionForm.tsx` → `TransactionForm.tsx`, point to `./hooks`/`./schemas` if/when used

6. **Utils:**
   - Create `utils/currency.ts` (formatCurrency, parseCurrency)
   - Optionally extend `utils/date.ts` (formatDate, getThaiDate; can alias `transformDateThai`)

7. **Routes:**
   - `routes/product.tsx`: switch to `@/features/products/...`
   - `routes/transaction.tsx`: switch to `@/features/transactions/components/TransactionForm`
   - Create `routes/farmer.tsx` (minimal page)

### Phase B: Remove old files

8. Delete:
   - `src/utils/productUtils.ts`
   - `src/components/products/addProductForm.tsx`
   - `src/components/products/product-price/addProductPriceForm.tsx`
   - `src/components/products/removeProductDialog.tsx`
   - `src/components/products/productCard.tsx`
   - `src/components/products/emptyProduct.tsx`
   - `src/components/products/product-price/productPriceTable.tsx`
   - `src/components/transactions/transactionForm.tsx`

9. Remove now-empty dirs (optional):
   - `src/components/products/product-price/`
   - `src/components/products/` (if nothing else remains except what you choose to keep in `components/`)
   - `src/components/transactions/`

### Phase C: Regenerate and verify

10. Run `pnpm build` or `pnpm dev` so TanStack Router regenerates `routeTree.gen.ts` (it should include `/farmer`).
11. Search for `@/utils/productUtils` and `components/products/` and `components/transactions/` to ensure no stale imports.
12. Run tests / manual smoke test: Product list, add product, add price, delete product; Transaction page; Farmer page.

---

## 5. Path Aliases

`tsconfig.json` has `"@/*": ["./src/*"]`. No change needed. Use:

- `@/features/products/api`
- `@/features/products/hooks`
- `@/features/products/schemas`
- `@/features/products/types`
- `@/features/products/components/AddProductForm`
- `@/features/farmers/...`
- `@/features/transactions/...`
- `@/utils/currency`
- `@/utils/date`

---

## 6. Farmer API / Schema Hints

From `db/schema.ts` and `db/relations.ts`:

- Table: `farmers` with `farmerId`, `name`, etc.
- Relations: `employees`, `transactionGroups` to `farmers`.

For stubs:

- `fetchFarmer`: `db.query.farmers.findMany()` or `findFirst` with `where`.
- `addFarmerDB`: `db.insert(farmers).values({ ... })`.
- `farmerSchema`: at least `name` and any required DB fields; extend when you build the real form.

---

## 7. Optional: Barrel Exports

You can add index files to simplify imports, e.g.:

- `features/products/index.ts` re-exporting `api`, `hooks`, `schemas`, `types`, and component names.

Use only if you prefer `@/features/products` over `@/features/products/hooks` etc.

---

## 8. What Stays in `src/components/`

- `nav-bar.tsx`
- `ui/*` (shared UI primitives)
- `storybook/*`
- `component-example.tsx`, `example.tsx` (if you keep them)

---

## 9. Notes

- **ProductPriceForm**: `productId` in `defaultValues` depends on `productPriceData` from `fetchProductPriceById`. Keep that query in the component; import `fetchProductPriceById` from `@/features/products/api`.
- **ProductCard**: The `item` type can live in `features/products/types.ts` and be imported by `ProductCard` and the product route.
- **RemoveProductDialog**: Props `isDelete`, `setIsDelete`, `productId`, `productName` stay as-is; only import `useDeleteProduct` from `@/features/products/hooks`.
- **routeTree.gen.ts**: Do not edit by hand; it will update when `routes/farmer.tsx` exists and you run the dev server or build.

---

**Next step:** Run Phase A and B in order, then Phase C. If you want, we can do this refactor in smaller steps (e.g. products only first).
