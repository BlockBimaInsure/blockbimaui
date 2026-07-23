import { requireAuth, canAccess } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import { ProductTable } from "@/components/products/product-table";

export default async function ProductsPage() {
  const user = await requireAuth();
  if (!canAccess(user, "products")) redirect("/access-denied");
  const { data: products, total } = await api.listProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="text-sm text-muted-foreground">{total} total</p>
      </div>
      <ProductTable products={products} />
    </div>
  );
}
