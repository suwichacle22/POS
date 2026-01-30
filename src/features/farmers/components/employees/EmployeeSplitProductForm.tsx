import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import z from "zod";
import { useAppForm } from "@/components/form/formContext";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { fetchProduct, fetchProductForm } from "@/features/products/api";
import { productDefaultType, promotionTo } from "@/utils/selectDefault";
import { fetchEmployeeSplitProduct } from "../../api";
import { useAddEmployeeSplitProduct } from "../../hooks";
import { formEmployeeSplitProductSchema } from "../../schemas";

const formId = "employee-split-product-form";
const defaultSelectProduct = { value: "", label: "กำลังโหลด" };

export default function EmployeeSplitProductForm({
	employeeId,
	setIsAddSplitProduct,
}: {
	employeeId: string;
	setIsAddSplitProduct: (isAddSplitProduct: boolean) => void;
}) {
	const { data: productSelectFormData = [defaultSelectProduct] } = useQuery({
		queryKey: ["product", "form"],
		queryFn: fetchProductForm,
	});
	const { data: productsData } = useQuery({
		queryKey: ["product"],
		queryFn: fetchProduct,
	});
	const { data: EmployeeSplitProductData = [] } = useQuery({
		queryKey: ["employee", employeeId],
		queryFn: () => fetchEmployeeSplitProduct({ data: { employeeId } }),
	});

	const addEmployeeSplitProduct = useAddEmployeeSplitProduct();
	const form = useAppForm({
		defaultValues: {
			employeeId: employeeId,
			productId: "",
			splitType: "",
			farmerSplitRatio: undefined,
			employeeSplitRatio: undefined,
			harvestRate: undefined,
			promotionTo: "employee",
			transportationFee: undefined,
		},
		validators: {
			onSubmit: formEmployeeSplitProductSchema,
		},
		onSubmit: async ({ value }) => {
			console.log(value);
			await addEmployeeSplitProduct.mutateAsync(value, {
				onSuccess: () => {
					setIsAddSplitProduct(false);
				},
			});
		},
	});
	return (
		<form
			id={formId}
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<FieldGroup>
				<div className="grid grid-cols-2 gap-4">
					<form.AppField
						name="productId"
						listeners={{
							onChangeDebounceMs: 500,
							onChange: ({ value }) => {
								form.setFieldValue(
									"splitType",
									productsData?.find((product) => product.productId === value)
										?.defaultSplitType ?? "",
								);
							},
						}}
						children={(field) => (
							<field.ComboBoxField
								label="สินค้า"
								selectData={productSelectFormData}
								orientation="vertical"
							/>
						)}
					/>
					<form.AppField
						name="splitType"
						children={(field) => (
							<field.SelectField
								label="ประเภทแบ่งส่วน"
								items={productDefaultType}
								orientation="vertical"
							/>
						)}
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<form.AppField
						name="farmerSplitRatio"
						listeners={{
							onChangeDebounceMs: 100,
							onChange: ({ value }) => {
								const FarmerRatioValue = parseFloat(value ?? "");
								if (!FarmerRatioValue) {
									return;
								}
								form.setFieldValue(
									"employeeSplitRatio",
									(1.0 - FarmerRatioValue).toFixed(2),
								);
							},
						}}
						children={(field) => (
							<field.NumericField
								label="สัดส่วนเถ้าแก่"
								orientation="vertical"
								placeholder="ตัวอย่าง: 0.6"
							/>
						)}
					/>
					<form.AppField
						name="employeeSplitRatio"
						children={(field) => (
							<field.NumericField
								label="สัดส่วนคนตัด"
								disabled={true}
								orientation="vertical"
								placeholder="ตัวอย่าง: 0.4"
							/>
						)}
					/>
				</div>
				{/* Palm */}
				<div className="grid grid-cols-1 gap-4">
					<form.AppField
						name="harvestRate"
						children={(field) => (
							<field.NumericField
								label="อัตราค่าตัด"
								orientation="vertical"
								placeholder="ตัวอย่าง: 0.8"
							/>
						)}
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<form.AppField
						name="transportationFee"
						children={(field) => (
							<field.NumericField
								label="ค่านำส่ง"
								orientation="vertical"
								placeholder="ตัวอย่าง: 0.1 เท่ากับ 10 สตางค์"
							/>
						)}
					/>
					<form.AppField
						name="promotionTo"
						children={(field) => (
							<field.SelectField
								label="ค่านำส่ง"
								orientation="vertical"
								items={promotionTo}
							/>
						)}
					/>
				</div>
			</FieldGroup>
			<div className="flex justify-end mt-4">
				<form.AppForm>
					<form.SubmitButton />
				</form.AppForm>
			</div>
		</form>
	);
}
