import { useState } from "react";
import { toast } from "sonner";
import { createCategorySchema } from "@ecomm/shared";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../../api/categoriesApi";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

function AdminCategoriesPage() {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function handleCreate(event) {
    event.preventDefault();
    const result = createCategorySchema.safeParse({ name });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid category name.");
      return;
    }
    setError("");
    try {
      await createCategory(result.data).unwrap();
      toast.success("Category created.");
      setName("");
    } catch (submitError) {
      toast.error(submitError?.data?.message ?? "Could not create category.");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted.");
    } catch (deleteError) {
      toast.error(deleteError?.data?.message ?? "Could not delete category.");
    }
  }

  if (isLoading) return <Spinner label="Loading categories" />;

  return (
    <div>
      <form className="admin-form" onSubmit={handleCreate}>
        <Field label="New category name" error={error}>
          {(id) => (
            <input
              id={id}
              className="ui-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          )}
        </Field>
        <Button type="submit" isLoading={isCreating}>
          Add category
        </Button>
      </form>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(categories ?? []).map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(category.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCategoriesPage;
