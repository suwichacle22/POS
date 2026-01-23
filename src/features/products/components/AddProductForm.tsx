import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { formProductSchema } from "@/features/products/schemas";
import { useAddProduct } from "@/features/products/hooks";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { toast } from "sonner";

const defaultSplitType = [
	{ value: "percentage", label: "แบ่งส่วน แบบยาง" },
	{ value: "per_kg", label: "ค่าตัด แบบปาล์ม" },
];

const formId = "add-product-form";

export default function AddProductForm({
	handleIsAddProductClick,
	setIsAddProduct,
}: {
	handleIsAddProductClick: () => void;
	setIsAddProduct: (isAddProduct: boolean) => void;
}) {
	const addProduct = useAddProduct();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm({
		defaultValues: {
			productName: "",
			defaultSplitType: "percentage",
		},
		validators: {
			onSubmit: formProductSchema,
		},
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			addProduct.mutate({ data: value }, {onSuccess: () => {
				form.reset();
				setIsSubmitting(false);
				setIsAddProduct(false);
			}, onError: () => {
				setIsSubmitting(false);
				console.log("error add product");
				toast.error("เพิ่มสินค้าไม่สำเร็จ", );
			}});
			
		},
	});
	return (
		<Card className="w-80">
			<CardHeader>
				<CardTitle>แบบฟอร์มเพิ่มสินค้า</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					id={formId}
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field
							name="productName"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel>เพิ่มสินค้า</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											autoComplete="off"
											aria-invalid={isInvalid}
											placeholder="ชื่อสินค้า ตัวอย่าง ยางแผ่น, ปาล์ม..."
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="defaultSplitType"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field orientation="responsive" data-invalid={isInvalid}>
										<FieldLabel>ประเภทการแบ่ง</FieldLabel>
										<Select
											name={field.name}
											value={field.state.value}
											items={defaultSplitType}
											onValueChange={(e) => field.handleChange(e as string)}
										>
											<SelectTrigger
												aria-invalid={isInvalid}
												className="min-w-30"
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{defaultSplitType.map((item) => (
														<SelectItem key={item.value} value={item.value}>
															{item.label}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter>
				<Field orientation="horizontal" className="flex justify-end">
					<Button
						type="button"
						variant="ghost"
						onClick={handleIsAddProductClick}
					>
						ยกเลิก
					</Button>
					<Button type="submit" form={formId} disabled={isSubmitting}>
						{isSubmitting ? <Spinner /> : null} ยืนยัน
					</Button>
				</Field>
			</CardFooter>
		</Card>
	);
}
