import Content from '#models/content'
import Course from '#models/course'
import Lesson from '#models/lesson'
import User from '#models/user'
import { createContentValidator } from '#validators/content'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class ContentsController {
  async index({ response, params, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const lesson = await Lesson.findOrFail(params.lessonId)
      await Course.query()
        .where((query) => {
          query.where('visibility', true).orWhere('userId', user.id)
        })
        .andWhere('id', lesson.courseId)
        .firstOrFail()

      const contents = await Content.query().where('lessonId', lesson.id)

      return response.ok(contents)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  private verifyPermission(user: User, course: Course) {
    if (course.userId !== user.id)
      return {
        errors: [
          {
            message: 'Unauthorized access',
          },
        ],
      }
    return false
  }

  async store({ request, response, params, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const lesson = await Lesson.findOrFail(params.lessonId)
      const course = await Course.findOrFail(lesson.courseId)
      const noPermission = this.verifyPermission(user, course)

      if (noPermission) return response.badRequest(noPermission)

      const { file } = await request.validateUsing(createContentValidator)
      const content = await Content.create({
        name: file.clientName,
        file: `${cuid()}.${file.extname}`,
        lessonId: lesson.id,
      })
      await file.move(app.makePath('files/content'), { name: content.file })

      return response.ok(content)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async destroy({ response, params, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const content = await Content.findOrFail(params.contentId)
      const lesson = await Lesson.findOrFail(content.lessonId)
      const course = await Course.findOrFail(lesson.courseId)
      const noPermission = this.verifyPermission(user, course)

      if (noPermission) return response.badRequest(noPermission)

      //TODO: Exclusão do arquivo

      await content.delete()

      return response.noContent()
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
