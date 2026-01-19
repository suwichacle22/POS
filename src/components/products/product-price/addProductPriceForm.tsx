import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
	fetchProductPriceById,
	formProductPrice,
	useAddProductPrice,
} from "@/utils/product";

export default function AddProductPriceForm({
	productId,
	setIsAddProductPrice,
}: {
	productId: string;
	setIsAddProductPrice: (isAddProductPrice: boolean) => void;
}) {
	const addProductPrice = useAddProductPrice(productId);
	const { data: productPriceData } = useQuery({
		queryKey: ["product", productId],
		queryFn: () => fetchProductPriceById({ data: { productId } }),
	});
	console.log(productPriceData);
	const formId = "form-add-product-price";
	const form = useForm({
		defaultValues: {
			productId: productId,
			price: productPriceData?.[0]?.price ?? "0.00",
		},
		validators: {
			onSubmit: formProductPrice,
		},
		onSubmit: async ({ value }) => {
			console.log("product price", value);
			addProductPrice.mutate({ data: value });
		},
	});
	return (
		<form
			id={formId}
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
				setIsAddProductPrice(false);
			}}
		>
			<FieldGroup className="mt-2">
				<form.Field
					name="price"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid} orientation="horizontal">
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									autoComplete="off"
									inputMode="decimal"
									aria-invalid={isInvalid}
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}

								<Button type="submit" disabled={addProductPrice.isPending}>
									{addProductPrice.isPending ? <Spinner /> : null} ยืนยัน
								</Button>
							</Field>
						);
					}}
				/>
			</FieldGroup>
		</form>
	);
}
