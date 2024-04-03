import User from '#models/user'
import { createUserValidator } from '#validators/user'
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

  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createUserValidator)
      const user = await User.create(payload)

      return response.ok(user)
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
