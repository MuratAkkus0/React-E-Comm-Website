import type { NextFunction, Request, Response } from "express";
import * as cartService from "./cart.service.js";

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.getCart(req.user!.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

export async function addItem(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.addItem(req.user!.id, req.body);
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.updateItem(
      req.user!.id,
      Number(req.params.productId),
      req.body,
    );
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.removeItem(req.user!.id, Number(req.params.productId));
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

export async function clearCart(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.clearCart(req.user!.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

export async function mergeCart(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.mergeCart(req.user!.id, req.body);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}
