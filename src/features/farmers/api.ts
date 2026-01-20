import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { farmers } from "@/db/schema";
import { farmerSchema } from "./schemas";

export const fetchFarmer = createServerFn({ method: "GET" }).handler(
	async () => {
		return await db.query.farmers.findMany({
			orderBy: { createdAt: "desc" },
		});
	},
);

export const addFarmerDB = createServerFn({ method: "POST" })
	.inputValidator(farmerSchema)
	.handler(async ({ data }) => {
		await db.insert(farmers).values(data);
	});
