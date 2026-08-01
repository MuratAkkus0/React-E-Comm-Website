import type { NextFunction, Request, Response } from "express";
import type { PaginationQuery } from "@ecomm/shared";
import * as reviewsService from "./reviews.service.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, pageSize } = res.locals.query as PaginationQuery;
    const result = await reviewsService.listReviews(Number(req.params.productId), page, pageSize);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const review = await reviewsService.createReview(
      req.user!.id,
      Number(req.params.productId),
      req.body,
    );
    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}
