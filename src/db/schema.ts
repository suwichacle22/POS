import {
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const transactionStatusEnum = pgEnum("transaction_status", [
	"pending",
	"submitted",
]);
export const paidTypeEnum = pgEnum("transaction_types", [
	"cash",
	"bank transfer",
]);
export const customerTypeEnum = pgEnum("customer_type", ["farmer", "employee"]);
export const productSplitTypeEnum = pgEnum("product_split_type_enum", [
	"percentage",
	"per_kg",
]);

export const farmers = pgTable("farmers", {
	farmerId: uuid("farmer_id").primaryKey().notNull().defaultRandom(),
	displayName: text("display_name").notNull().unique(),
	phone: text("phone"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const employees = pgTable("employees", {
	employeeId: uuid("employee_id").primaryKey().defaultRandom(),
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

export const products = pgTable("products", {
	productId: uuid("product_id").primaryKey().defaultRandom(),
	productName: text("product_name").notNull().unique(),
	defaultSplitType: productSplitTypeEnum("default_split_type").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const productPrices = pgTable("product_prices", {
	productPriceId: uuid("product_price_id").primaryKey().defaultRandom(),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.productId),
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const splitDefaults = pgTable("split_defaults", {
	splitDefaultId: uuid("split_default_id").primaryKey().defaultRandom(),
	employeeId: uuid("employee_id")
		.notNull()
		.references(() => employees.employeeId),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.productId),
	splitType: productSplitTypeEnum("split_type").notNull(),
	farmerSplitRatio: numeric("farmer_split_ratio", {
		precision: 3,
		scale: 2,
	}),
	employeeSplitRatio: numeric("employee_split_ratio", {
		precision: 3,
		scale: 2,
	}),
	harvestRate: numeric("harvest_rate", { precision: 3, scale: 2 }),
	promotionTo: customerTypeEnum("promotion_to").default("employee"),
	transportationFee: numeric("transportation_fee", {
		precision: 3,
		scale: 2,
	}),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const transactionGroups = pgTable("transaction_groups", {
	transactionGroupId: uuid("transaction_group_id").primaryKey().defaultRandom(),
	farmerId: uuid("farmer_id")
		.notNull()
		.references(() => farmers.farmerId),
	groupName: text("group_name"),
	status: transactionStatusEnum("status").notNull().default("pending"),
	printCount: integer("print_count").notNull().default(0),
	createdAt: timestamp("created_at").defaultNow(),
	submittedAt: timestamp("submitted_at"),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const transactionLines = pgTable("transaction_lines", {
	transactionId: uuid("transaction_id").primaryKey().defaultRandom(),
	transactionGroupId: uuid("transaction_group_id")
		.notNull()
		.references(() => transactionGroups.transactionGroupId),
	employeeId: uuid("employee_id").references(() => employees.employeeId),
	productId: uuid("product_id").references(() => products.productId),
	weightVehicleIn: numeric("weight_vehicle_in", {
		precision: 10,
		scale: 2,
	}),
	weightVehicleOut: numeric("weight_vehicle_out", {
		precision: 10,
		scale: 2,
	}),
	weight: numeric("weight", {
		precision: 10,
		scale: 2,
	}).notNull(),
	price: numeric("price", {
		precision: 10,
		scale: 2,
	}).notNull(),
	splitType: productSplitTypeEnum("split_type").notNull().default("percentage"),
	farmerRatio: numeric("farmer_ratio", {
		precision: 3,
		scale: 2,
	}),
	employeeRatio: numeric("employee_ratio", {
		precision: 3,
		scale: 2,
	}),
	farmerPaidType: paidTypeEnum("farmer_paid_type").notNull().default("cash"),
	employeePaidType: paidTypeEnum("employee_paid_type")
		.notNull()
		.default("cash"),
	harvestRate: numeric("harvest_rate", {
		precision: 3,
		scale: 2,
	}),
	transportationFee: numeric("transportation_fee", {
		precision: 3,
		scale: 2,
	}),
	carLicense: text("car_license"),
	promotionRate: numeric("promotion_rate", {
		precision: 3,
		scale: 2,
	}),
	promotionTo: customerTypeEnum("promotion_to").default("employee"),
	createdAt: timestamp("created_at").defaultNow(),
	submittedAt: timestamp("submitted_at"),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
});
