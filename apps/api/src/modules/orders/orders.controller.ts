import type { NextFunction, Request, Response } from "express";
import type { PaginationQuery } from "@ecomm/shared";
import * as ordersService from "./orders.service.js";

export async function checkout(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.checkout(req.user!.id, req.body);
    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, pageSize } = res.locals.query as PaginationQuery;
    const result = await ordersService.listOrdersForUser(req.user!.id, page, pageSize);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.getOrder(req.user!, Number(req.params.id));
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

export async function pay(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.payOrder(req.user!, Number(req.params.id));
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

export async function cancel(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.cancelOrder(req.user!, Number(req.params.id));
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.updateOrderStatus(Number(req.params.id), req.body.status);
    res.json({ order });
  } catch (err) {
    next(err);
  }
}
