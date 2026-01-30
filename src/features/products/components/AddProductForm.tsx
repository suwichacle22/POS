import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { useAppForm } from "@/components/form/formContext";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useAddProduct } from "@/features/products/hooks";
import { formProductSchema } from "@/features/products/schemas";
import { productDefaultType } from "@/utils/selectDefault";

const formId = "add-product-form";

export default function AddProductForm({
	handleIsAddProductClick,
	setIsAddProduct,
}: {
	handleIsAddProductClick: () => void;
	setIsAddProduct: (isAddProduct: boolean) => void;
}) {
	const addProduct = useAddProduct();

	const form = useAppForm({
		defaultValues: {
			productName: "",
			defaultSplitType: "percentage",
		},
		validators: {
			onSubmit: formProductSchema,
		},
		onSubmit: async ({ value }) => {
			const result = formProductSchema.parse(value);
			await addProduct.mutateAsync(
				{ data: result },
				{
					onSuccess: () => {
						form.reset();
						setIsAddProduct(false);
					},
					onError: () => {
						toast.error("เพิ่มสินค้าไม่สำเร็จ");
					},
				},
			);
		},
	});
	return (
		<Card className="w-80">
			<form
				id={formId}
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<CardHeader>
					<CardTitle>แบบฟอร์มเพิ่มสินค้า</CardTitle>
					<CardDescription></CardDescription>
				</CardHeader>

				<CardContent>
					<FieldGroup>
						<form.AppField
							name="productName"
							children={(field) => (
								<field.TextField
									label="เพิ่มสินค้า"
									placeholder="ชื่อสินค้า ตัวอย่าง ยางแผ่น, ปาล์ม..."
								/>
							)}
						/>
						<form.AppField
							name="defaultSplitType"
							children={(field) => (
								<field.SelectField
									label="ประเภทแบ่งส่วนสินค้า"
									items={productDefaultType}
								/>
							)}
						/>
					</FieldGroup>
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="flex mt-4 justify-end">
						<Button
							type="button"
							variant="ghost"
							onClick={handleIsAddProductClick}
						>
							ยกเลิก
						</Button>
						<form.AppForm>
							<form.SubmitButton />
						</form.AppForm>
					</Field>
				</CardFooter>
			</form>
		</Card>
	);
}
