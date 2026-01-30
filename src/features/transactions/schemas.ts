import { formOptions } from "@tanstack/react-form";
import z from "zod";

// Transaction form/validation schemas — extend when building the form
export const transactionFormSchema = z.object({
	farmerId: z.string().min(1, "โปรดใส่ชื่อลูกค้า"),
	groupName: z.string().nullable(),
	status: z.enum(["pending", "submitted"]),
});
export const transactionGroupFormSchema = z.object({
	farmerId: z.string(),
	groupName: z.string().nullable(),
	status: z.enum(["pending", "submitted"]),
});

// {
//     farmerId: string;
//     transactionGroupId?: string | undefined;
//     createdAt?: Date | null | undefined;
//     updatedAt?: Date | null | undefined;
//     groupName?: string | null | undefined;
//     status?: "pending" | "submitted" | undefined;
//     printCount?: number | undefined;
//     submittedAt?: Date | null | undefined;
// }

// {
//     transactionGroupId: string;
//     employeeId: string;
//     weight: string;
//     price: string;
//     createdAt?: Date | null | undefined;
//     updatedAt?: Date | null | undefined;
//     submittedAt?: Date | null | undefined;
//     transactionId?: string | undefined;
//     productId?: string | null | undefined;
//     weightVehicleIn?: string | null | undefined;
//     weightVehicleOut?: string | null | undefined;
//     splitType?: "percentage" | "per_kg" | undefined;
//     farmerRatio?: string | null | undefined;
//     employeeRatio?: string | null | undefined;
//     harvestRate?: string | null | undefined;
//     transportationFee?: string | ... 1 more ... | undefined;
//     carLicense?: string | ... 1 more ... | undefined;
//     promotionRate?: string | ... 1 more ... | undefined;
//     promotionTo?: "farmer" | ... 2 more ... | undefined;
// }

export const transactionFormOpts = formOptions({
	defaultValues: {
		transactionGroup: {
			transactionGroupId: "",
			farmerId: "",
			groupName: "",
			status: "pending",
		},
		transactionLine: {
			transactionId: "",
			employeeId: "",
			productId: "",
			weightVehicleIn: "",
			weightVehicleOut: "",
			weight: "",
			price: "",
			splitType: "",
			farmerRatio: "",
			employeeRatio: "",
			harvestRate: "",
			transportationFee: "",
			carLicense: "",
			promotionRate: "",
			promotionTo: "employee",
			createdAt: new Date(),
			submittedAt: null,
			updatedAt: new Date(),
		},
	},
});
