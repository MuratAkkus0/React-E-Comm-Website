import { useState } from "react";
import { toast } from "sonner";
import { createProductSchema, formatMoney } from "@ecomm/shared";
import { useGetCategoriesQuery } from "../../api/categoriesApi";
import {
  useAdjustProductStockMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../api/productsApi";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
};

function AdminProductsPage() {
  const { data: categories } = useGetCategoriesQuery();
  const { data, isLoading } = useGetProductsQuery({
    page: 1,
    pageSize: 100,
    sort: "newest",
    includeInactive: true,
  });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [adjustStock] = useAdjustProductStockMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreate(event) {
    event.preventDefault();

    const parsed = createProductSchema.safeParse({
      name: form.name,
      description: form.description,
      priceCents: Math.round(Number(form.price) * 100),
      currency: "EUR",
      stock: Number(form.stock),
      categoryId: Number(form.categoryId),
      isActive: true,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid product.");
      return;
    }
    setError("");

    try {
      await createProduct(parsed.data).unwrap();
      toast.success("Product created.");
      setForm(EMPTY_FORM);
    } catch (submitError) {
      toast.error(submitError?.data?.message ?? "Could not create product.");
    }
  }

  async function handleToggleActive(product) {
    try {
      await updateProduct({ id: product.id, isActive: !product.isActive }).unwrap();
      toast.success(product.isActive ? "Product deactivated." : "Product activated.");
    } catch (toggleError) {
      toast.error(toggleError?.data?.message ?? "Could not update product.");
    }
  }

  async function handleStockAdjust(product, delta) {
    try {
      await adjustStock({ id: product.id, delta }).unwrap();
    } catch (stockError) {
      toast.error(stockError?.data?.message ?? "Could not adjust stock.");
    }
  }

  async function handleDelete(product) {
    try {
      await deleteProduct(product.id).unwrap();
      toast.success("Product deleted.");
    } catch (deleteError) {
      toast.error(deleteError?.data?.message ?? "Could not delete product.");
    }
  }

  return (
    <div>
      <form className="admin-form" onSubmit={handleCreate}>
        <Field label="Name" error={error}>
          {(id) => (
            <input
              id={id}
              className="ui-input"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          )}
        </Field>
        <Field label="Description">
          {(id) => (
            <input
              id={id}
              className="ui-input"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          )}
        </Field>
        <Field label="Price (EUR)">
          {(id) => (
            <input
              id={id}
              type="number"
              min="0"
              step="0.01"
              className="ui-input"
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
            />
          )}
        </Field>
        <Field label="Stock">
          {(id) => (
            <input
              id={id}
              type="number"
              min="0"
              className="ui-input"
              value={form.stock}
              onChange={(event) => updateField("stock", event.target.value)}
            />
          )}
        </Field>
        <Field label="Category">
          {(id) => (
            <select
              id={id}
              className="ui-select"
              value={form.categoryId}
              onChange={(event) => updateField("categoryId", event.target.value)}
            >
              <option value="">Select...</option>
              {(categories ?? []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Button type="submit" isLoading={isCreating}>
          Add product
        </Button>
      </form>

      {isLoading ? (
        <Spinner label="Loading products" />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data.items.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{formatMoney(product.priceCents, product.currency)}</td>
                  <td>
                    <div className="admin-table__actions">
                      <Button size="sm" variant="secondary" onClick={() => handleStockAdjust(product, -1)}>
                        -1
                      </Button>
                      {product.stock}
                      <Button size="sm" variant="secondary" onClick={() => handleStockAdjust(product, 1)}>
                        +1
                      </Button>
                    </div>
                  </td>
                  <td>{product.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <div className="admin-table__actions">
                      <Button size="sm" variant="secondary" onClick={() => handleToggleActive(product)}>
                        {product.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(product)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;
