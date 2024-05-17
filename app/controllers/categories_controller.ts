import Category from '#models/category'
import { createCategoryValidator, updateCategoryValidator } from '#validators/category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  async index({ response }: HttpContext) {
    try {
      const categories = await Category.all()

      return response.ok(categories)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async show({ response, params }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.categoryId)

      return response.ok(category)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createCategoryValidator)
      const category = await Category.create(payload)

      return response.ok(category)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async update({ request, response, params }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.categoryId)
      const payload = await request.validateUsing(updateCategoryValidator)

      category.merge(payload)
      await category.save()

      return response.ok(category)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async destroy({ response, params }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.categoryId)

      await category.delete()

      return response.noContent()
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async link({ response, params }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.categoryId)

      await category.related('courses').attach([params.courseId])

      return response.noContent()
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async unlink({ response, params }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.categoryId)

      await category.related('courses').detach([params.courseId])

      return response.noContent()
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
