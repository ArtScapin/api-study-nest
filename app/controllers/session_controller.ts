import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async show({ response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()

      return response.ok(user)
    } catch (error) {
      return response.unauthorized()
    }
  }
  async store({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const user = await User.verifyCredentials(email, password)
      const rawToken = await User.accessTokens.create(user, ['*'], {
        expiresIn: '2 hours',
      })
      const { type, token } = rawToken.toJSON()

      return response.ok({ username: user.username, type, token })
    } catch (error) {
      return response.unauthorized()
    }
  }
}
