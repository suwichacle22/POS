import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useAppForm } from "@/components/form/formContext";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { fetchProductPriceById } from "@/features/products/api";
import { useAddProductPrice } from "@/features/products/hooks";
import { formProductPrice } from "@/features/products/schemas";

export default function ProductPriceForm({
	productId,
	setIsAddProductPrice,
}: {
	productId: string;
	setIsAddProductPrice: (isAddProductPrice: boolean) => void;
}) {
	const addProductPrice = useAddProductPrice();
	const { data: productPriceData } = useQuery({
		queryKey: ["product", productId],
		queryFn: () => fetchProductPriceById({ data: { productId } }),
	});
	const formId = "form-add-product-price";
	const form = useAppForm({
		defaultValues: {
			productId: productId,
			price: productPriceData?.[0]?.price ?? "0.00",
		},
		validators: {
			onSubmit: formProductPrice,
		},
		onSubmit: async ({ value }) => {
			await addProductPrice.mutateAsync({ data: value });
			setIsAddProductPrice(false);
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
			<FieldGroup className="mt-2">
				<form.AppField
					name="price"
					children={(field) => <field.NumericField label="ราคาสินค้า" />}
				/>
				<form.AppForm>
					<form.SubmitButton />
				</form.AppForm>
			</FieldGroup>
		</form>
	);
}
