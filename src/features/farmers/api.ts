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
	.inputValidator(z.object({ farmerId: z.string() }))
	.handler(async ({ data: { farmerId } }) => {
		await db.delete(farmers).where(eq(farmers.farmerId, farmerId));
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
	.inputValidator(z.object({ employeeId: z.string() }))
	.handler(async ({ data: { employeeId } }) => {
		await db.delete(employees).where(eq(employees.employeeId, employeeId));
	});
