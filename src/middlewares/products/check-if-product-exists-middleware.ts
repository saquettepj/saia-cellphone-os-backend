import { Request, Response, NextFunction } from "express";
import { knex } from "@/database/database-config"
import { MiddlewareError } from "@/utils/MiddlewareError";
import { ISimpleProductDTO } from "@/dtos/products/simple-products-dto";


async function checkProductExistsMiddleware(request: Request, response: Response, next: NextFunction) {
  const { uuid } = ISimpleProductDTO.parse(request.params)

  try {
    const product = await knex<ProductRepository>("products").where({ uuid }).first()

    if (!product) {
      return next(new MiddlewareError("Product not found!", 404));
    }

    next();
  } catch (error) {
    next(error);
  }
}

export default checkProductExistsMiddleware;