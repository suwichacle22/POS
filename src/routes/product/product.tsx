import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/product/product')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/product/product"!</div>
}
