import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useAppForm } from "@/components/form/formContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transactionFormOpts } from "../schemas";
import { TransactionGroupForm } from "./TransactionGroupForm";

export default function TransactionMainForm() {
	const formId = "transaction-form";
	const form = useAppForm({
		...transactionFormOpts,
		onSubmit: async ({ value }) => {
			toast.success(JSON.stringify(value));
		},
	});
	return (
		<div className="grid grid-cols-3 gap-4 p-4">
			<form
				id={formId}
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<TransactionGroupForm form={form} />
			</form>
		</div>
	);
}
