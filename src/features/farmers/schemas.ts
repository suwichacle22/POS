import z from "zod";
import { employees, farmers } from "@/db/schema";

//farmer section
export const formFarmerSchema = z.object({
	displayName: z.string().min(1, "โปรดใส่ชื่อ"),
	phone: z.string().nullable(),
});
export type FarmerSchema = typeof farmers.$inferSelect;

//employee section
export const formEmployeeSchema = z.object({
	displayName: z.string().min(1, "โปรดใส่ชื่อ"),
	farmerId: z.string(),
});

export const formEmployeeSplitProductSchema = z.object({
	employeeId: z.string(),
	productId: z.string(),
	splitType: z.enum(["percentage", "per_kg"]),
	farmerSplitRatio: z.coerce
		.number()
		.gt(0, "โปรดใส่ส่วนของเถ้าแก่ให้ถูกต้อง")
		.nullable(),
	employeeSplitRatio: z.string().nullable(),
	harvestRate: z.string().nullable(),
	transportationFee: z.string().nullable(),
	promotionTo: z.enum(["farmer", "employee"]),
});

export type EmployeeSchemaTable = typeof employees.$inferSelect;

export interface EmployeeSplitProductSchemaTable {
	farmerId: string;
	displayName: string;
	phone?: string;
	employeeId: string;
	address?: string;
	splitDefaults: {
		createdAt?: Date;
		updatedAt?: Date;
		employeeId: string;
		productId: string;
		splitDefaultId: string;
		splitType: "percentage" | "per_kg";
		farmerSplitRatio?: string;
		employeeSplitRatio?: string;
		harvestRate?: string;
		promotionTo?: "farmer" | "employee";
		transportationFee?: string;
	}[];
}
