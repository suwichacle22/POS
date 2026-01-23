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
	};
}
