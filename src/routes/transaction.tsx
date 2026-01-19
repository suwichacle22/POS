import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/transaction")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/transaction"!</div>;
}
