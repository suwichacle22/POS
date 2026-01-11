import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/product/add_product")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/product/add_product"!</div>;
}
