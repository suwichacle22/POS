import { createFileRoute } from "@tanstack/react-router";
import AddProductForm from "@/components/products/addProductForm";
import { Activity, useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import EmptyProduct from "@/components/products/emptyProduct";
import ProductCard from "@/components/products/productCard";

const loaderProduct = createServerFn({ method: "GET" }).handler(async () =>
  db.query.products.findMany(),
);

export const Route = createFileRoute("/product/overview")({
  component: RouteComponent,
  loader: loaderProduct,
});

function RouteComponent() {
  const productData = Route.useLoaderData() || [];
  const [isAddProduct, setIsAddProduct] = useState<"hidden" | "visible">(
    "hidden",
  );
  const handleIsAddProductClick = () => {
    setIsAddProduct((c) => (c === "hidden" ? "visible" : "hidden"));
  };
  return (
    <div className="">
      <div className="flex flex-row justify-end p-2 w-full">
        <Button type="button" onClick={handleIsAddProductClick}>
          เพิ่มสินค้า
        </Button>
      </div>
      <Activity mode={isAddProduct}>
        <div className="flex justify-center">
          <AddProductForm />
        </div>
      </Activity>
      {productData.length === 0 ? <EmptyProduct /> : null}
      <div className="grid p-6 m-6">
        {productData.map((item) => {
          return <ProductCard item={item} />;
        })}
      </div>
    </div>
  );
}
