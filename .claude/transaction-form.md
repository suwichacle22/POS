# Transaction Form — Data Storage Reference

This document maps **what the transaction form collects** to **what gets stored in the database**.

---

## Tables Involved

The transaction form writes to **2 tables** (and optionally **3 more** for inline creation):

| Table | Purpose |
|-------|---------|
| `transaction_groups` | One per farmer visit (group of lines) |
| `transaction_lines` | One per product entry in the group |
| `farmers` | (inline creation only) |
| `employees` | (inline creation only) |
| `split_defaults` | (auto-save on first transaction per employee-product) |

---

## transaction_groups

Created once per farmer visit. Even single-line transactions need a group.

| Column | Type | Form Field | Notes |
|--------|------|------------|-------|
| `transaction_group_id` | uuid | — | Auto-generated PK |
| `farmer_id` | uuid | Farmer dropdown | Required, FK → farmers |
| `group_name` | text | Note field | Optional label ("สวน A", "ล็อต 2") |
| `status` | enum | — | Default "pending", changes to "submitted" on payment |
| `print_count` | integer | — | Default 0, increments on print |
| `created_at` | timestamp | — | Auto-set |
| `submitted_at` | timestamp | — | Set when status → "submitted" |
| `updated_at` | timestamp | — | Auto-updated |

---

## transaction_lines

One row per product line added to the group.

| Column | Type | Form Field | Notes |
|--------|------|------------|-------|
| `transaction_id` | uuid | — | Auto-generated PK |
| `transaction_group_id` | uuid | — | FK → transaction_groups |
| `employee_id` | uuid | Employee dropdown / "own" | FK → employees. Uses "own" employee if checkbox unchecked |
| `product_id` | uuid | Product dropdown | FK → products |
| `weight` | numeric(10,2) | Weight input | Required, in kg |
| `weight_vehicle_in` | numeric(10,2) | — | Optional (future: Palm weighing) |
| `weight_vehicle_out` | numeric(10,2) | — | Optional (future: Palm weighing) |
| `price` | numeric(10,2) | Auto-filled | Locked at transaction time from latest `product_prices` |
| `split_type` | enum | Auto-filled / override | "percentage" (Rubber) or "per_kg" (Palm) |
| `farmer_ratio` | numeric(3,2) | Ratio input | For percentage split (e.g., 0.60). Null if per_kg |
| `employee_ratio` | numeric(3,2) | Ratio input | For percentage split (e.g., 0.40). Null if per_kg |
| `harvest_rate` | numeric(3,2) | Harvest rate input | For per_kg split (baht/kg). Null if percentage |
| `transportation_fee` | numeric(3,2) | Transportation fee input | Ratio of weight, Rubber only, usually null |
| `car_license` | text | Car license input | Palm only, null for Rubber |
| `promotion_rate` | numeric(3,2) | Promotion input | Extra baht/kg, Palm only |
| `promotion_to` | enum | Promotion recipient | "farmer" or "employee", Palm only |
| `farmer_paid_type` | enum | — | "cash" or "bank transfer" |
| `employee_paid_type` | enum | — | "cash" or "bank transfer" |
| `created_at` | timestamp | — | Auto-set |
| `submitted_at` | timestamp | — | Set when group submitted |
| `updated_at` | timestamp | — | Auto-updated |

---

## Form Field → Database Mapping

### Group-Level Fields (Step 1-2)

| Form Field | Stored In | Column |
|------------|-----------|--------|
| Farmer dropdown | `transaction_groups` | `farmer_id` |
| Note (optional) | `transaction_groups` | `group_name` |

### Line-Level Fields (Step 3-9, repeatable)

| Form Field | Stored In | Column | Condition |
|------------|-----------|--------|-----------|
| Checkbox "แบ่งกับลูกจ้าง" | `transaction_lines` | `employee_id` | Unchecked → "own" employee |
| Employee dropdown | `transaction_lines` | `employee_id` | Only if checkbox checked |
| Product dropdown | `transaction_lines` | `product_id` | — |
| Weight (kg) | `transaction_lines` | `weight` | — |
| Price (auto) | `transaction_lines` | `price` | Fetched from `product_prices` |
| Split type | `transaction_lines` | `split_type` | From product default or override |
| Farmer ratio | `transaction_lines` | `farmer_ratio` | Percentage split only |
| Employee ratio | `transaction_lines` | `employee_ratio` | Percentage split only |
| Harvest rate | `transaction_lines` | `harvest_rate` | Per-kg split only (Palm) |
| Transportation fee | `transaction_lines` | `transportation_fee` | Rubber only, rare |
| Car license | `transaction_lines` | `car_license` | Palm only |
| Promotion rate | `transaction_lines` | `promotion_rate` | Palm only |
| Promotion to | `transaction_lines` | `promotion_to` | Palm only |

---

## Calculated Values (NOT Stored)

These are calculated on display/print, not saved to database:

| Value | Formula |
|-------|---------|
| **Total** | `weight × price` |
| **Farmer amount** (percentage) | `total × farmer_ratio` |
| **Employee amount** (percentage) | `total × employee_ratio` |
| **Harvester amount** (per_kg) | `weight × harvest_rate` |
| **Farmer amount** (per_kg) | `total - harvester_amount` |
| **Transportation deduction** | `(weight × transportation_fee) × price` — deducted from employee, added to farmer |
| **Promotion amount** | `weight × promotion_rate` — goes to `promotion_to` recipient |

---

## Auto-Fill Behavior

| When | Action |
|------|--------|
| Product selected | Fetch latest price from `product_prices` (ORDER BY created_at DESC LIMIT 1) |
| Product selected | Fetch split defaults from `split_defaults` for this employee-product combo |
| First transaction for employee-product | Save values to `split_defaults` for future auto-fill |

---

## Conditional UI Logic

| Condition | UI Behavior | Data Effect |
|-----------|-------------|-------------|
| Checkbox unchecked | Hide employee dropdown, hide split fields | Use "own" employee (100/0 split) |
| Checkbox checked | Show employee dropdown, show split fields | Use selected employee |
| Product = Rubber | Show percentage ratio fields, transportation fee | `split_type` = "percentage" |
| Product = Palm | Show harvest rate, car license, promotion fields | `split_type` = "per_kg" |

---

## Inline Creation

| Action | Tables Affected |
|--------|-----------------|
| Add new farmer | `farmers` (insert), `employees` (insert "own" record) |
| Add new employee | `employees` (insert) |

---

## Status Flow

```
pending (default)
    ↓ [Submit / Mark as Paid]
submitted
```

- **pending**: Can edit freely
- **submitted**: Still editable (trust-based family system), `submitted_at` gets timestamp

---

## Invoice Generation (Read-Only)

Two invoice types, both read from same data:

| Invoice Type | Shows |
|--------------|-------|
| Farmer invoice | All lines, all employees, summary breakdown |
| Employee invoice | Only that employee's lines, hides farmer portion |
