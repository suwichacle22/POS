import { createFileRoute } from "@tanstack/react-router";
import TransactionFormMainCard from "@/features/transactions/components/TransactionCard";
import TransactionForm from "@/features/transactions/components/TransactionForm";

export const Route = createFileRoute("/transactions")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex justify-center items-center">
			<div className="flex gap-4 p-4 justify-center items-center w-full">
				<TransactionFormMainCard />
			</div>
		</div>
	)
}
