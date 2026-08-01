import type { NextFunction, Request, Response } from "express";
import type { OrderStatus } from "../../generated/prisma/client.js";
import type { PaginationQuery } from "@ecomm/shared";
import * as adminService from "./admin.service.js";
import * as ordersService from "../orders/orders.service.js";

export async function stats(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getDashboardStats();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function listOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, pageSize } = res.locals.query as PaginationQuery;
    const status = req.query.status as OrderStatus | undefined;
    const result = await ordersService.listOrdersAdmin(status, page, pageSize);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
