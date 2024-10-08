import { knex } from "@/database/database-config"

import { NextFunction, Request, Response } from "express"

import { ICreateProductDTO } from "@/dtos/products/create-products-dto"
import { ISimpleProductDTO } from "@/dtos/products/simple-products-dto"
import { IProductUpdateResponseBody } from "./products-controller-interface"
import { ResponseError } from "@/utils/ResponseError"


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

      if (updatedEntity) {
        const responseBody: IProductUpdateResponseBody = {
          uuid: updatedEntity.uuid,
          name: updatedEntity.name,
          price: Number(updatedEntity.price),
          created_at: new Date(updatedEntity.created_at),
          updated_at: new Date(updatedEntity.updated_at)
        }
        
        return response.status(200).json(responseBody)

      } else throw new ResponseError()

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