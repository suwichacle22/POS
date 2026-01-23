import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { transactionFormSchema } from "../schemas";

export default function TransactionForm() {
	const formId = "transaction-form";
	const form = useForm({
		defaultValues: {
			farmerId: "",
			groupName: null as null | string,
			status: "pending",
		},
		validators: { onSubmit: transactionFormSchema },
		onSubmit: async ({ value }) => {
			toast.success(JSON.stringify(value));
		},
	});
	return (
		<form
			id={formId}
			className="flex flex-col gap-4"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.Field
				name="farmerId"
				children={(field) => {
					const isInvalid =
						field.state.meta.isTouched && !field.state.meta.isValid;
					return (
						<Field data-invalid={isInvalid}>
							<FieldLabel>Farmer Name</FieldLabel>
							<Input
								id={field.name}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							{isInvalid && <FieldError errors={field.state.meta.errors} />}
						</Field>
					);
				}}
			/>
			<form.Field
				name="groupName"
				children={(field) => (
					<Field>
						<FieldLabel>Group Name</FieldLabel>
						<Input
							id={field.name}
							value={field.state.value || ""}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="ตัวอย่าง: เจ๊น้อยปาล์ม รอบวันที่ 22 มกราคม 2566"
						/>
					</Field>
				)}
			/>
			<Button type="submit" onClick={form.handleSubmit}>
				Submit
			</Button>
		</form>
	);
}
