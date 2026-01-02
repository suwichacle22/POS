import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const farmers = pgTable("farmers", {
  farmerId: uuid("farmer_id").primaryKey(),
  displayName: text("display_name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const employees = pgTable("employee", {
  employeeId: uuid("employee_id").primaryKey(),
  farmerId: uuid("farmer_id")
    .notNull()
    .references(() => farmers.farmerId),
  displayName: text("display_name").notNull(),
  address: text("address"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const productSplitTypeEnum = pgEnum("product_split_type_enum", [
  "percentage",
  "per_kg",
]);

export const products = pgTable("product", {
  productId: uuid("product_id").primaryKey(),
  product_name: text("product_name").notNull(),
  defaultSplitType: productSplitTypeEnum("default_split_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const product_prices = pgTable("product_price", {
  productPriceId: uuid("product_price_id").primaryKey(),
  productId: uuid("product_id").references(() => products.productId),
  price: numeric("price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const splitDefaults = pgTable("split_defaults", {
  splitDefaultId: uuid("split_default_id").primaryKey(),
  employeeId: uuid("employee_id").references(() => employees.employeeId),
  productId: uuid("product_id").references(() => products.productId),
  splitType: productSplitTypeEnum("split_type").notNull(),
  farmerSplitRatio: numeric("farmer_split_ratio"),
  employeeSplitRatio: numeric("employee_split_ratio"),
  harvestRate: numeric("harvest_rate"),
  transportationFee: numeric("transportation_fee"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "submitted",
]);

export const transactionGroups = pgTable("transaction_groups", {
  transactionGroupId: uuid("transaction_group_id").primaryKey(),
  farmerId: uuid("farmer_id").references(() => farmers.farmerId),
  groupName: text("group_name"),
  status: transactionStatusEnum("status").notNull(),
  printCount: integer("print_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  submittedAt: timestamp("submitted_at"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const transactions = pgTable("transactions", {
  transactionId: uuid("transaction_id").primaryKey(),
  transactionGroupId: uuid("transaction_group_id").references(
    () => transactionGroups.transactionGroupId,
  ),
  employeeId: uuid("employee_id").references(() => employees.employeeId),
  productId: uuid("product_id").references(() => products.productId),
  weight: numeric("weight").notNull(),
  price: numeric("price").notNull(),
  splitType: productSplitTypeEnum("split_type").notNull(),
  farmerRatio: numeric("farmer_ratio"),
  employeeRatio: numeric("employee_ratio"),
  harvestRate: numeric("harvest_rate"),
  transportationFee: numeric("transportation_fee"),
  carLicense: text("car_license"),
  promotionRate: numeric("promotion_rate"),
  createdAt: timestamp("created_at").defaultNow(),
  submittedAt: timestamp("submitted_at"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
