import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.ts";

export const relations = defineRelations(schema, (r) => ({
	farmers: {
		employees: r.many.employees(),
		transactionGroups: r.many.transactionGroups(),
	},
	employees: {
		farmers: r.one.farmers({
			from: r.employees.farmerId,
			to: r.farmers.farmerId,
		}),
		splitDefaults: r.many.splitDefaults(),
	},
	products: {
		productPrices: r.many.productPrices(),
		splitDefaults: r.many.splitDefaults(),
		transactionLines: r.many.transactionLines(),
	},
	productPrices: {
		products: r.one.products({
			from: r.productPrices.productId,
			to: r.products.productId,
		}),
	},
	splitDefaults: {
		employees: r.one.employees({
			from: r.splitDefaults.employeeId,
			to: r.employees.employeeId,
		}),
		products: r.one.products({
			from: r.splitDefaults.productId,
			to: r.products.productId,
		}),
	},
	transactionGroups: {
		transactionLines: r.many.transactionLines(),
		farmers: r.one.farmers({
			from: r.transactionGroups.farmerId,
			to: r.farmers.farmerId,
		}),
	},
	transactionLines: {
		transactionGroups: r.one.transactionGroups({
			from: r.transactionLines.transactionGroupId,
			to: r.transactionGroups.transactionGroupId,
		}),
		products: r.one.products({
			from: r.transactionLines.productId,
			to: r.products.productId,
		}),
	},
}));
