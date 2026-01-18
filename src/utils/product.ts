import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { productPrices, products } from "@/db/schema";

export type FormProductType = z.infer<typeof formProductSchema>;

export const formProductSchema = z.object({
	productName: z.string().min(1, "โปรดใส่ชื่อ"),
	defaultSplitType: z.enum(["percentage", "per_kg"]),
});

export const formProductPrice = z.object({
	productId: z.string(),
	price: z.coerce
		.number("โปรดใส่ราคาให้ถูกต้อง")
		.gte(0.01, "โปรดใส่มากกว่า 0.01")
		.transform((val) => String(val))
		.nullable(),
});

export const fetchProduct = createServerFn({ method: "GET" }).handler(
	async () => {
		return await db.query.products.findMany({
			with: { productPrices: { orderBy: { createdAt: "desc" } } },
		});
	},
);

export const fetchProductPriceById = createServerFn({ method: "GET" })
	.inputValidator(z.object({ productId: z.string() }))
	.handler(async ({ data: { productId } }) => {
		return await db.query.productPrices.findMany({
			where: { productId: productId },
			orderBy: { createdAt: "desc" },
			limit: 7,
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

export const productQueryOptions = () =>
	queryOptions({
		queryKey: ["product"],
		queryFn: fetchProduct,
	});

export const productPriceQueryOptions = () =>
	queryOptions({
		queryKey: ["product", "price"],
		queryFn: fetchProduct,
	});

export const useAddProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addProductDB,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["product"] });
		},
	});
};

export const useAddProductPrice = (productId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addProductPriceDB,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["product", productId] });
		},
	});
};

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteProductDB,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["product"] });
		},
	});
};
