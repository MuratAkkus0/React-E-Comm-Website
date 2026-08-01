import { prisma } from "../../lib/prisma.js";

export function findAll() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export function findById(id: number) {
  return prisma.category.findUnique({ where: { id } });
}

export function findBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export function countProductsInCategory(categoryId: number) {
  return prisma.product.count({ where: { categoryId } });
}

export function create(data: { name: string; slug: string }) {
  return prisma.category.create({ data });
}

export function update(id: number, data: { name?: string; slug?: string }) {
  return prisma.category.update({ where: { id }, data });
}

export function remove(id: number) {
  return prisma.category.delete({ where: { id } });
}
