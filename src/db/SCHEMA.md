# Database Schema Documentation

**Project:** POS System for Rubber & Palm Middleman Business
**Database:** PostgreSQL
**ORM:** Drizzle ORM
**Last Updated:** 2026-01-12

---

## Overview

This database supports a Point-of-Sale system for a middleman business that:
- Purchases rubber (ยางแผ่น, น้ำยาง, ยางถ้วย) and palm (ปาล์ม) from farmers
- Tracks payment splits between farmers and their employees/harvesters
- Manages pricing history and transaction groups

---

## Table of Contents

1. [Enums](#enums)
2. [Tables](#tables)
   - [farmers](#farmers)
   - [employees](#employees)
   - [products](#products)
   - [productPrices](#productprices)
   - [splitDefaults](#splitdefaults)
   - [transactionGroups](#transactiongroups)
   - [transactionLines](#transactionlines)
3. [Relationships](#relationships)
4. [Business Logic](#business-logic)
5. [Data Types & Precision](#data-types--precision)

---

## Enums

### `transactionStatusEnum`
**Values:** `"pending"` | `"submitted"`

- `pending`: Transaction created but not yet paid
- `submitted`: Transaction paid and finalized

**Usage:** `transactionGroups.status`

---

### `customerTypeEnum`
**Values:** `"farmer"` | `"employee"`

**Usage:**
- `splitDefaults.promotionTo`
- `transactionLines.promotionTo`

**Purpose:** Indicates who receives promotional payments

---

### `productSplitTypeEnum`
**Values:** `"percentage"` | `"per_kg"`

- `percentage`: Used for rubber products (split by ratio of total value)
- `per_kg`: Used for palm products (employee paid per kg harvested)

**Usage:**
- `products.defaultSplitType`
- `splitDefaults.splitType`
- `transactionLines.splitType`

---

## Tables

### `farmers`

**Purpose:** Stores farmer/farm owner information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `farmerId` | uuid | PRIMARY KEY, AUTO | Unique identifier |
| `displayName` | text | NOT NULL, UNIQUE | Format: "name-location" (e.g., "โกตี๋-นาสาร") |
| `phone` | text | NULLABLE | Contact number |
| `createdAt` | timestamp | DEFAULT NOW | Record creation time |
| `updatedAt` | timestamp | AUTO UPDATE | Last modification time |

**Notes:**
- `displayName` must be unique to prevent duplicates
- When a farmer is created, an "own" employee should be auto-created for self-sales
- Display names include location/identifier to differentiate farmers with same names

---

### `employees`

**Purpose:** Workers who harvest/collect products for farmers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `employeeId` | uuid | PRIMARY KEY, AUTO | Unique identifier |
| `farmerId` | uuid | NOT NULL, FK → farmers | Owner farmer |
| `displayName` | text | NOT NULL | Employee name ("own" for self-employee) |
| `address` | text | NULLABLE | Farm/work location |
| `phone` | text | NULLABLE | Contact number |
| `createdAt` | timestamp | DEFAULT NOW | Record creation time |
| `updatedAt` | timestamp | AUTO UPDATE | Last modification time |

**Notes:**
- Each farmer has an "own" employee (displayName = "own") for 100/0 splits
- Employees belong to ONE farmer (if they work for multiple, create separate records)

---

### `products`

**Purpose:** Types of products purchased (rubber/palm varieties)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `productId` | uuid | PRIMARY KEY, AUTO | Unique identifier |
| `productName` | text | NOT NULL, UNIQUE | ยางแผ่น, น้ำยาง, ยางถ้วย, ปาล์ม |
| `defaultSplitType` | enum | NOT NULL | "percentage" or "per_kg" |
| `createdAt` | timestamp | DEFAULT NOW | Record creation time |
| `updatedAt` | timestamp | AUTO UPDATE | Last modification time |

**Typical Products:**
- ยางแผ่น (Rubber Sheet) - percentage split
- น้ำยาง (Latex) - percentage split
- ยางถ้วย (Cup Rubber) - percentage split
- ปาล์ม (Palm) - per_kg split

---

### `productPrices`

**Purpose:** Historical pricing (baht per kg) for each product

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `productPriceId` | uuid | PRIMARY KEY, AUTO | Unique identifier |
| `productId` | uuid | NOT NULL, FK → products | Product being priced |
| `price` | numeric(10,2) | NOT NULL | Price in baht per kg |
| `createdAt` | timestamp | DEFAULT NOW | When price was set |

**Notes:**
- Query latest price: `ORDER BY createdAt DESC LIMIT 1`
- Price is locked at transaction time (stored in transactionLines)
- Maintains price history for auditing

---

### `splitDefaults`

**Purpose:** Default split ratios for each employee-product combination

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `splitDefaultId` | uuid | PRIMARY KEY, AUTO | Unique identifier |
| `employeeId` | uuid | NOT NULL, FK → employees | Employee these defaults apply to |
| `productId` | uuid | NOT NULL, FK → products | Product these defaults apply to |
| `splitType` | enum | NOT NULL | "percentage" or "per_kg" |
| `farmerSplitRatio` | numeric(3,2) | NULLABLE | 0.00-1.00 (null if per_kg) |
| `employeeSplitRatio` | numeric(3,2) | NULLABLE | 0.00-1.00 (null if per_kg) |
| `harvestRate` | numeric(3,2) | NULLABLE | Baht per kg (null if percentage) |
| `promotionTo` | enum | DEFAULT "employee" | Who gets promotions |
| `transportationFee` | numeric(3,2) | NULLABLE | Baht per kg deducted from employee |
| `createdAt` | timestamp | DEFAULT NOW | Record creation time |
| `updatedAt` | timestamp | AUTO UPDATE | Last modification time |

**Notes:**
- Saved automatically on first transaction for each employee-product pair
- Auto-fills transaction forms on subsequent sales
- Can be overridden per-transaction without changing defaults
- Editable in employee settings screen

---

### `transactionGroups`

**Purpose:** Groups multiple transaction lines from a single farmer visit

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `transactionGroupId` | uuid | PRIMARY KEY, AUTO | Unique identifier |
| `farmerId` | uuid | NOT NULL, FK → farmers | Farmer selling products |
| `groupName` | text | NULLABLE | Optional label ("สวน A", "ล็อต 2") |
| `status` | enum | NOT NULL, DEFAULT "pending" | "pending" or "submitted" |
| `printCount` | integer | NOT NULL, DEFAULT 0 | How many times invoice printed |
| `createdAt` | timestamp | DEFAULT NOW | When group was created |
| `submittedAt` | timestamp | NULLABLE | When marked as paid |
| `updatedAt` | timestamp | AUTO UPDATE | Last modification time |

**Notes:**
- Always create a group, even for single line
- One group = one farmer visit
- Status changes to "submitted" when paid (submittedAt populated)
- Can edit even after submission (trust-based system)

---

### `transactionLines`

**Purpose:** Individual product transactions within a group

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `transactionId` | uuid | PRIMARY KEY, AUTO | Unique identifier |
| `transactionGroupId` | uuid | NOT NULL, FK → transactionGroups | Parent group |
| `employeeId` | uuid | NOT NULL, FK → employees | Worker who harvested/collected |
| `productId` | uuid | NULLABLE, FK → products | Product sold (null for autosave) |
| `weightVehicleIn` | numeric(10,2) | NULLABLE | Vehicle weight entering (with load) |
| `weightVehicleOut` | numeric(10,2) | NULLABLE | Vehicle weight leaving (empty) |
| `weight` | numeric(10,2) | NOT NULL | Net weight in kg |
| `price` | numeric(10,2) | NOT NULL | Locked price at time of sale |
| `splitType` | enum | NOT NULL, DEFAULT "percentage" | "percentage" or "per_kg" |
| `farmerRatio` | numeric(3,2) | NULLABLE | 0.00-1.00 (null if per_kg) |
| `employeeRatio` | numeric(3,2) | NULLABLE | 0.00-1.00 (null if per_kg) |
| `harvestRate` | numeric(3,2) | NULLABLE | Baht per kg (null if percentage) |
| `transportationFee` | numeric(3,2) | NULLABLE | Baht per kg (Rubber only, rare) |
| `carLicense` | text | NULLABLE | Vehicle plate (Palm only) |
| `promotionRate` | numeric(3,2) | NULLABLE | Extra baht per kg |
| `promotionTo` | enum | DEFAULT "employee" | "farmer" or "employee" |
| `createdAt` | timestamp | DEFAULT NOW | Record creation time |
| `submittedAt` | timestamp | NULLABLE | When parent group submitted |
| `updatedAt` | timestamp | AUTO UPDATE | Last modification time |

**Notes:**
- `productId` can be null during autosave (before user selects product)
- Must have `productId` before group can be submitted
- Payment calculations are NOT stored - calculated from fields on-demand
- `weightVehicleIn/Out` added for future weight reconciliation

---

## Relationships

### Visual Diagram

```
farmers (1) ──→ (many) employees
farmers (1) ──→ (many) transactionGroups

employees (1) ──→ (many) splitDefaults
employees (1) ──→ (many) transactionLines

products (1) ──→ (many) productPrices
products (1) ──→ (many) splitDefaults
products (1) ──→ (many) transactionLines

transactionGroups (1) ──→ (many) transactionLines

splitDefaults (many) ──→ (1) employees
splitDefaults (many) ──→ (1) products

transactionLines (many) ──→ (1) transactionGroups
transactionLines (many) ──→ (1) employees
transactionLines (many) ──→ (1) products (nullable)
```

### Defined Relations (Drizzle v2)

**Farmers:**
- `employees` (one-to-many)
- `transactionGroups` (one-to-many)

**Employees:**
- `farmer` (many-to-one) - via `farmerId`
- `splitDefaults` (one-to-many)

**Products:**
- `productPrices` (one-to-many)
- `splitDefaults` (one-to-many)
- `transactionLines` (one-to-many)

**Product Prices:**
- `product` (many-to-one) - via `productId`

**Split Defaults:**
- `employee` (many-to-one) - via `employeeId`
- `product` (many-to-one) - via `productId`

**Transaction Groups:**
- `transactionLines` (one-to-many)
- `farmer` (many-to-one) - via `farmerId`

**Transaction Lines:**
- `transactionGroup` (many-to-one) - via `transactionGroupId`
- `product` (many-to-one) - via `productId`

**Note:** `employee → transactionLines` relation intentionally NOT defined (queried manually when needed)

---

## Business Logic

### Split Calculations

#### Percentage Split (Rubber Products)

```
Total = weight × price
Farmer gets = Total × farmerRatio
Employee gets = Total × employeeRatio

# With transportation fee (rare):
Transport amount = weight × transportationFee (baht/kg)
Employee final = (Total × employeeRatio) - Transport amount
Farmer final = (Total × farmerRatio) + Transport amount
```

**Example:**
```
Weight: 3500 kg
Price: 50 baht/kg
Farmer ratio: 0.6 (60%)
Employee ratio: 0.4 (40%)
Transportation fee: 0.5 baht/kg

Total = 3500 × 50 = 175,000 baht
Transport = 3500 × 0.5 = 1,750 baht

Employee = (175,000 × 0.4) - 1,750 = 68,250 baht
Farmer = (175,000 × 0.6) + 1,750 = 106,750 baht
```

---

#### Per-Kg Split (Palm Products)

```
Total = weight × price
Harvester gets = weight × harvestRate (baht/kg)
Farmer gets = Total - Harvester amount

# With promotion:
Promotion amount = weight × promotionRate (baht/kg)
Add to farmer OR employee (not split)
```

**Example:**
```
Weight: 3500 kg
Price: 5 baht/kg
Harvest rate: 0.5 baht/kg
Promotion: 0.1 baht/kg to employee

Total = 3500 × 5 = 17,500 baht
Harvester = 3500 × 0.5 = 1,750 baht
Farmer = 17,500 - 1,750 = 15,750 baht
Promotion = 3500 × 0.1 = 350 baht (separate receipt)
```

---

### Important Rules

1. **Do NOT store calculated values**
   - Never store total amounts, farmer/employee splits
   - Always calculate from: weight, price, ratios, rates

2. **Employee validation**
   - Enforce that `transactionLine.employeeId` belongs to the farmer in the parent `transactionGroup`
   - Validate in application layer (not database constraint)

3. **Product nullability**
   - Allow null `productId` during autosave
   - Must validate all lines have products before group can be submitted

4. **Price locking**
   - Transaction always locks price at time of sale
   - Query latest price from `productPrices` when creating transaction
   - Store in `transactionLines.price`

5. **Ratios must sum to 1.0**
   - For percentage splits: `farmerRatio + employeeRatio = 1.0`
   - Validate in application layer

---

## Data Types & Precision

### Numeric Fields

**Money values** (price, rates):
- Type: `numeric(10, 2)`
- Range: -99,999,999.99 to 99,999,999.99
- Used for: `price`, `weight`, `weightVehicleIn`, `weightVehicleOut`

**Ratios & Rates** (percentages, per-kg amounts):
- Type: `numeric(3, 2)`
- Range: -9.99 to 9.99
- Used for: `farmerRatio`, `employeeRatio`, `harvestRate`, `transportationFee`, `promotionRate`

**Rationale:**
- Ratios: 0.00 to 1.00 (0% to 100%)
- Harvest rates: typically 0.5 to 1.5 baht/kg (max seen: 1.1)
- Promotion rates: typically 0.1 to 0.3 baht/kg
- Transportation fees: typically 0.5 baht/kg (rare, edge case)

### Timestamps

All timestamps use PostgreSQL `timestamp` type:
- `createdAt`: Auto-set on insert
- `updatedAt`: Auto-updated on modification (via `.$onUpdate()`)
- `submittedAt`: Manually set when status changes to "submitted"

### UUIDs

All primary keys use UUID v4:
- Generated with `.defaultRandom()`
- No need to provide IDs in application code

---

## Query Patterns

### Get farmer with all employees
```typescript
const farmer = await db.query.farmers.findFirst({
  where: eq(farmers.farmerId, id),
  with: { employees: true },
});
```

### Get transaction group with lines and farmer
```typescript
const group = await db.query.transactionGroups.findFirst({
  where: eq(transactionGroups.transactionGroupId, id),
  with: {
    transactionLines: true,
    farmer: true,
  },
});
```

### Get latest price for a product
```typescript
const latestPrice = await db.query.productPrices.findFirst({
  where: eq(productPrices.productId, productId),
  orderBy: desc(productPrices.createdAt),
});
```

### Get split defaults for employee-product
```typescript
const defaults = await db.query.splitDefaults.findFirst({
  where: and(
    eq(splitDefaults.employeeId, employeeId),
    eq(splitDefaults.productId, productId)
  ),
});
```

### Get all transaction lines for an employee (manual query - no relation)
```typescript
const lines = await db.select()
  .from(transactionLines)
  .where(eq(transactionLines.employeeId, employeeId));
```

---

## Migration Notes

- Schema managed with Drizzle Kit
- Migrations located in `/drizzle/migrations/`
- Run: `drizzle-kit generate` then `drizzle-kit migrate`
- Database: PostgreSQL on Synology NAS (local network)

---

## Future Considerations

**Planned additions (not yet implemented):**
- Factory sales tracking
- Shipment/delivery tracking
- Weight reconciliation (compare purchase vs delivery weights)
- Remainder calculations (purchases - sales)
- Multi-user auth/permissions

---

## Contact & Context

- **Project**: POS ยาง-ปาล์ม (Rubber & Palm POS)
- **Environment**: Local network only (no internet access)
- **Users**: Family members (trusted, non-technical)
- **Tech Stack**: TanStack Start (SPA mode), Drizzle ORM, PostgreSQL
- **SSR**: Not needed (internal tool, no SEO)

For full business requirements, see `CLAUDE.md` in project root.
