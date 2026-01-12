import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "@/db";
import { products } from "@/db/schema";

export type FormProductType = z.infer<typeof formProductSchema>;

export const formProductSchema = z.object({
	productName: z.string().min(1, "โปรดใส่ชื่อ"),
	defaultSplitType: z.literal(["percentage", "per_kg"]),
});

export const fetchProduct = createServerFn({ method: "GET" }).handler(
	async () => {
		return await db.query.products.findMany();
	},
);

export const addProductToDB = createServerFn({ method: "POST" })
	.inputValidator(formProductSchema)
	.handler(async ({ data }) => {
		await db.insert(products).values(data);
	});

export const productQueryOptions = () =>
	queryOptions({
		queryKey: ["product"],
		queryFn: fetchProduct,
	});

export const useAddProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addProductToDB,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["product"] });
		},
	});
};
