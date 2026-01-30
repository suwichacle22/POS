import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { employees, farmers, splitDefaults } from "@/db/schema";
import { formFarmerSchema } from "./schemas";

export const fetchFarmer = createServerFn({ method: "GET" }).handler(
	async () => {
		return await db.query.farmers.findMany({
			orderBy: { createdAt: "asc" },
		});
	},
);

export const addFarmerDB = createServerFn({ method: "POST" })
	.inputValidator(formFarmerSchema)
	.handler(async ({ data }) => {
		return await db.insert(farmers).values(data).returning();
	});

export const deleteFarmerDB = createServerFn({ method: "POST" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data: { id } }) => {
		await db.delete(farmers).where(eq(farmers.farmerId, id));
	});

//employee section
export const fetchEmployee = createServerFn({ method: "GET" })
	.inputValidator(z.object({ farmerId: z.string() }))
	.handler(async ({ data: { farmerId } }) => {
		return await db.query.employees.findMany({
			where: { farmerId: farmerId },
			orderBy: { createdAt: "asc" },
			with: {
				splitDefaults: true,
			},
		});
	});

export const addEmployeeDB = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			farmerId: z.string(),
			displayName: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		return await db.insert(employees).values(data).returning();
	});

export const deleteEmployeeDB = createServerFn({ method: "POST" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data: { id } }) => {
		await db.delete(employees).where(eq(employees.employeeId, id));
	});

export const addEmployeeSplitProductDB = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			employeeId: z.string(),
			productId: z.string(),
			splitType: z.enum(["percentage", "per_kg"]),
			farmerSplitRatio: z.string().optional(),
			employeeSplitRatio: z.string().optional(),
			harvestRate: z.string().optional(),
			promotionTo: z.enum(["farmer", "employee"]).optional(),
			transportationFee: z.string().optional(),
		}),
	)
	.handler(async ({ data }) => {
		return await db.insert(splitDefaults).values(data).returning();
	});

export const fetchEmployeeSplitProduct = createServerFn({ method: "POST" })
	.inputValidator(z.object({ employeeId: z.string() }))
	.handler(async ({ data: { employeeId } }) => {
		return await db.query.splitDefaults.findMany({
			where: { employeeId: employeeId },
		});
	});
