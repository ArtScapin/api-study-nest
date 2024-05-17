import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ response }: HttpContext) {
    try {
      const users = await User.all()

      return response.ok(users)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async show({ response, params }: HttpContext) {
    try {
      const user = await User.findOrFail(params.userId)

      return response.ok(user)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createUserValidator)
      const user = await User.create(payload)

      return response.ok(user)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async update({ request, response, params }: HttpContext) {
    try {
      const user = await User.findOrFail(params.userId)
      const payload = await request.validateUsing(updateUserValidator)

      user.merge(payload)
      await user.save()

      return response.ok(user)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async destroy({ response, params }: HttpContext) {
    try {
      const user = await User.findOrFail(params.userId)

      await user.delete()

      return response.noContent()
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
