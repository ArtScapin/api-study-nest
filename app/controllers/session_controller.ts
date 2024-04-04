import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async store({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const user = await User.verifyCredentials(email, password)
      const rawToken = await User.accessTokens.create(user, ['*'], {
        expiresIn: '30 minutes',
      })
      const { type, token } = rawToken.toJSON()

      return response.ok({ type, token })
    } catch (error) {}
  }
}
