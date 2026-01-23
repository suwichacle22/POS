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
import { employees } from "@/db/schema";
import { useAddEmployee, useAddFarmer } from "../../hooks";
import { formEmployeeSchema, formFarmerSchema } from "../../schemas";

const formId = "add-employee-form";
const employeeSchema = employees.$inferInsert;

export default function AddEmployeeForm({
	isAddEmployee,
	setIsAddEmployee,
	farmerId,
}: {
	isAddEmployee: boolean;
	setIsAddEmployee: (isAddEmployee: boolean) => void;
	farmerId: string;
}) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const addEmployee = useAddEmployee();
	const form = useForm({
		defaultValues: {
			farmerId: farmerId,
			displayName: "",
		},
		validators: {
			onSubmit: formEmployeeSchema,
		},
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			addEmployee.mutate(
				{ data: value },
				{
					onSuccess: () => {
						form.reset();
						setIsSubmitting(false);
						setIsAddEmployee(false);
					},
					onError: () => {
						setIsSubmitting(false);
						toast.error("เพิ่มคนตัดไม่สำเร็จ");
					},
				},
			);
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
				<form.Field
					name="displayName"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid} orientation="horizontal">
								<FieldLabel className="w-[100px]">เพิ่มลูกน้อง</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									autoComplete="off"
									aria-invalid={isInvalid}
									placeholder="ชื่อลูกน้อง ..."
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
								<Button type="submit" form={formId} disabled={isSubmitting}>
									{isSubmitting ? <Spinner /> : null} ยืนยัน
								</Button>
							</Field>
						);
					}}
				/>
			</FieldGroup>
		</form>
	);
}
