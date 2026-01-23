import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { productPrices, products } from "@/db/schema";
import { formProductPrice, formProductSchema } from "./schemas";

export const fetchProduct = createServerFn({ method: "GET" }).handler(
	async () => {
		return await db.query.products.findMany({
			with: { productPrices: { orderBy: { createdAt: "desc" }, limit: 5 } },
		});
	},
);

export const fetchProductPriceById = createServerFn({ method: "GET" })
	.inputValidator(z.object({ productId: z.string() }))
	.handler(async ({ data: { productId } }) => {
		return await db.query.productPrices.findMany({
			where: { productId: productId },
			orderBy: { createdAt: "desc" },
			limit: 5,
		});
	});

export const addProductDB = createServerFn({ method: "POST" })
	.inputValidator(formProductSchema)
	.handler(async ({ data }) => {
		await db.insert(products).values(data);
	});

export const addProductPriceDB = createServerFn({ method: "POST" })
	.inputValidator(formProductPrice)
	.handler(async ({ data }) => {
		await db.insert(productPrices).values(data);
	});

export const deleteProductDB = createServerFn({ method: "POST" })
	.inputValidator(z.object({ productId: z.string() }))
	.handler(async ({ data: { productId } }) => {
		await db.delete(products).where(eq(products.productId, productId));
	});
