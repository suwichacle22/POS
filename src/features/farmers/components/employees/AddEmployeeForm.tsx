import { useState } from "react";
import { toast } from "sonner";
import { useAppForm } from "@/components/form/formContext";
import { Field, FieldGroup } from "@/components/ui/field";
import { useAddEmployee } from "../../hooks";
import { formEmployeeSchema } from "../../schemas";

const formId = "add-employee-form";

export default function AddEmployeeForm({
	setIsAddEmployee,
	farmerId,
}: {
	isAddEmployee: boolean;
	setIsAddEmployee: (isAddEmployee: boolean) => void;
	farmerId: string;
}) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const addEmployee = useAddEmployee();
	const form = useAppForm({
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
				<Field orientation="horizontal">
					<form.AppField
						name="displayName"
						children={(field) => (
							<field.TextField label="เพิ่มลูกน้อง" placeholder="ชื่อลูกน้อง ..." />
						)}
					/>

					<form.AppForm>
						<form.SubmitButton />
					</form.AppForm>
				</Field>
			</FieldGroup>
		</form>
	);
}
