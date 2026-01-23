import type { z } from "zod";
import type { formProductSchema } from "./schemas";

export type FormProductType = z.infer<typeof formProductSchema>;

export type ProductWithPrices = {
	createdAt: Date | null;
	updatedAt: Date | null;
	productId: string;
	productName: string;
	defaultSplitType: "percentage" | "per_kg";
	productPrices: {
		productId: string;
		price: string;
		createdAt: Date | null;
		productPriceId: string;
	}[];
};
