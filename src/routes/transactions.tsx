import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/spinner";
import TransactionFormMainCard from "@/features/transactions/components/TransactionMainForm";

export const Route = createFileRoute("/transactions")({
	component: RouteComponent,
	pendingComponent: () => {
		return (
			<div className="flex items-center gap-6 justify-center h-screen">
				<Spinner className="size-8" />
			</div>
		);
	},
});

function RouteComponent() {
	return (
		<div className="">
			<TransactionFormMainCard />
		</div>
	);
}
