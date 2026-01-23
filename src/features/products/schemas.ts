import z from "zod";

export const formProductSchema = z.object({
	productName: z.string().min(1, "โปรดใส่ชื่อ"),
	defaultSplitType: z.enum(["percentage", "per_kg"]),
});

export const formProductPrice = z.object({
	productId: z.string(),
	price: z.coerce.number("โปรดใส่ราคาให้ถูกต้อง").gte(0.01, "โปรดใส่มากกว่า 0.01"),
});
