import { createRouter, Link } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { Spinner } from "./components/ui/spinner";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const rqContext = TanstackQuery.getContext();

	const router = createRouter({
		routeTree,
		context: {
			...rqContext,
		},

		defaultPreload: "intent",
		defaultPendingComponent: () => {
			<div className="flex items-center gap-6">
				<Spinner className="size-8" />
			</div>;
		},
		defaultNotFoundComponent: () => {
			return (
				<div>
					<p>Not found!</p>
					<Link to="/">Go home</Link>
				</div>
			);
		},
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: rqContext.queryClient,
	});

	return router;
};
