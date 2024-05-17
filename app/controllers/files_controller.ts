import type { HttpContext } from '@adonisjs/core/http'
import * as fs from 'node:fs'

export default class FilesController {
  async thumbnail({ response, params }: HttpContext) {
    try {
      const path = `files/thumbnails/${params.id}`

      const image = fs.readFileSync(path)

      return response.type('image/jpeg').send(image)
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
