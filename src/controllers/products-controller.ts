import { knex } from "@/database/database-config"

import { NextFunction, Request, Response } from "express"

import { ICreateProductDTO } from "@/dtos/products/create-products-dto"
import { ISimpleProductDTO } from "@/dtos/products/simple-products-dto"


class ProductController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, price } = ICreateProductDTO.parse(request.body)

      await knex<ProductRepository>("products").insert({ name, price })

      return response.status(201).json()
    } catch (error) {
      next(error)
    }
  }

  async list(request: Request, response: Response, next: NextFunction){
    try {
      const { name } = request.query
      const products = await knex<ProductRepository>("products")
      .select()
      .whereLike("name", `%${name ?? ""}%`)

      return response.json(products)
    } catch (error) {
      next(error)
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { uuid } = ISimpleProductDTO.parse(request.params)
      const { name, price } = ICreateProductDTO.parse(request.body)

      await knex<ProductRepository>("products").update({ name, price, updated_at: knex.fn.now() })
      .where({ uuid })

      const updatedEntity = await knex<ProductRepository>("products").where({ uuid }).first()

      return response.status(200).json(updatedEntity)
    } catch (error) {
      next(error)
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const { uuid } = ISimpleProductDTO.parse(request.params)

      await knex<ProductRepository>("products").delete().where({ uuid })

      return response.status(200).json()
    } catch (error) {
      next(error)
    }
  }
}

export { ProductController }