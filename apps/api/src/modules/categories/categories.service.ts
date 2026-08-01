import type { CreateCategoryInput, UpdateCategoryInput } from "@ecomm/shared";
import { ConflictError, NotFoundError } from "../../lib/errors.js";
import * as categoriesRepository from "./categories.repository.js";

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function listCategories() {
  return categoriesRepository.findAll();
}

export async function getCategory(id: number) {
  const category = await categoriesRepository.findById(id);
  if (!category) throw new NotFoundError("Category not found.");
  return category;
}

export async function createCategory(input: CreateCategoryInput) {
  const slug = slugify(input.name);
  const existing = await categoriesRepository.findBySlug(slug);
  if (existing) {
    throw new ConflictError("A category with this name already exists.");
  }
  return categoriesRepository.create({ name: input.name, slug });
}

export async function updateCategory(id: number, input: UpdateCategoryInput) {
  await getCategory(id);
  const data: { name?: string; slug?: string } = {};
  if (input.name) {
    data.name = input.name;
    data.slug = slugify(input.name);
  }
  return categoriesRepository.update(id, data);
}

export async function deleteCategory(id: number) {
  await getCategory(id);
  const productCount = await categoriesRepository.countProductsInCategory(id);
  if (productCount > 0) {
    throw new ConflictError(
      "This category still has products assigned to it. Reassign or delete them first.",
    );
  }
  await categoriesRepository.remove(id);
}
