/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/AppError"
import { ZodError } from "zod"
import { MiddlewareError } from "@/utils/MiddlewareError"
import { ResponseError } from "@/utils/ResponseError"

export function errorHandling(
  error: any, 
  request: Request, 
  response: Response, 
  _: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  if(error instanceof ZodError) {
    return response.status(400).json({ message: "🔴 Validation Error 🔴 ", issues: error.format() })
  }

  if (error instanceof MiddlewareError) {
    return response.status(error.statusCode).json({ message: `⚠️ Middleware error ⚠️ ${error.message}` })
  }

  if (error instanceof ResponseError) {
    return response.status(error.statusCode).json({ message: `⚠️ Body response error ⚠️` })
  }

  return response.status(500).json({
    status: 'error',
    message: `❗ Internal server error ❗ ${error.message}`,
  })
}