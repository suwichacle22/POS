import { createFileRoute } from "@tanstack/react-router";
import TransactionCursor1 from "sandbox/transaction/transaction-cursor-1";
import TransactionCursor2 from "sandbox/transaction/transaction-cursor-2";
import TransactionForm from "@/features/transactions/components/TransactionForm";
import TransactionClaude1 from "./transaction/transaction-claude-1";
import TransactionClaude2 from "./transaction/transaction-claude-2";

export const Route = createFileRoute("/sandbox/transaction")({
	component: RouteComponent,
});

function RouteComponent({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<div className="h-5 bg-white" />
			<TransactionClaude1 />
			<div className="h-5 bg-white" />
			<TransactionClaude2 />
			<div className="h-5 bg-white" />
			<TransactionCursor1 />
			<div className="h-5 bg-white" />
			<TransactionCursor2 />
		</div>
	);
}
