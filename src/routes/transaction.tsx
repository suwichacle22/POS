import { createFileRoute } from "@tanstack/react-router";
import TransactionForm from "@/features/transactions/components/TransactionForm";

export const Route = createFileRoute("/transaction")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<TransactionForm />
		</div>
	);
}
