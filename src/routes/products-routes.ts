import { ProductController } from "@/controllers/products-controller"
import checkProductExistsMiddleware from "@/middlewares/products/check-if-product-exists-middleware"
import { Router } from "express"

const productsRoutes = Router()
const productsController = new ProductController()

productsRoutes.get("/", productsController.list)
productsRoutes.post("/", productsController.create)
productsRoutes.put("/:uuid", checkProductExistsMiddleware, productsController.update)
productsRoutes.delete("/:uuid", checkProductExistsMiddleware, productsController.delete)

export { productsRoutes }