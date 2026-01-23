import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
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
import { Spinner } from "@/components/ui/spinner";
import { useAddFarmer } from "../../hooks";
import { formFarmerSchema } from "../../schemas";

const formId = "add-farmer-form";

export default function AddFarmerForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const addFarmer = useAddFarmer();
	const form = useForm({
		defaultValues: {
			displayName: "",
			phone: null as null | string,
		},
		validators: {
			onSubmit: formFarmerSchema,
		},
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			addFarmer.mutate(
				{ data: value },
				{
					onSuccess: () => {
						form.reset();
						setIsSubmitting(false);
					},
					onError: () => {
						setIsSubmitting(false);
						toast.error("เพิ่มลูกค้าไม่สำเร็จ");
					},
				},
			);
		},
	});
	return (
		<Card className="w-80 h-[320px]">
			<CardHeader>
				<CardTitle>แบบฟอร์มเพิ่มลูกค้า</CardTitle>
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
							name="displayName"
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
											placeholder="ชื่อลูกค้า ..."
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="phone"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel>เบอร์โทรศัพท์</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value ?? ""}
											onChange={(e) => field.handleChange(e.target.value)}
											autoComplete="off"
											aria-invalid={isInvalid}
											placeholder="เบอร์มือถือ ..."
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter>
				<Field orientation="horizontal" className="flex justify-end">
					<Button type="submit" form={formId} disabled={isSubmitting}>
						{isSubmitting ? <Spinner /> : null} ยืนยัน
					</Button>
				</Field>
			</CardFooter>
		</Card>
	);
}
