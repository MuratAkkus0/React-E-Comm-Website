import type { NextFunction, Request, Response } from "express";
import type { ProductQuery } from "@ecomm/shared";
import * as productsService from "./products.service.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const query = res.locals.query as ProductQuery;
    const result = await productsService.listProducts(query, req.user?.role === "ADMIN");
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productsService.getProduct(String(req.params.idOrSlug));
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productsService.createProduct(req.body);
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productsService.updateProduct(Number(req.params.id), req.body);
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await productsService.deleteProduct(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function adjustStock(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productsService.adjustStock(Number(req.params.id), req.body);
    res.json({ product });
  } catch (err) {
    next(err);
  }
}
