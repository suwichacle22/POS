import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transactionFormSchema } from "../schemas";
import TransactionForm from "./TransactionForm";

export default function TransactionFormMainContainer() {
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
		<Card className="flex p-4 gap-4 justify-center w-[400px] lg:w-[500px]">
			<CardHeader>
				<CardTitle>Transaction</CardTitle>
			</CardHeader>
			<CardContent>
				<TransactionForm />
			</CardContent>
		</Card>
	);
}
