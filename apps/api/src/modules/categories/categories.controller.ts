import type { NextFunction, Request, Response } from "express";
import * as categoriesService from "./categories.service.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await categoriesService.listCategories();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoriesService.createCategory(req.body);
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoriesService.updateCategory(Number(req.params.id), req.body);
    res.json({ category });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await categoriesService.deleteCategory(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
