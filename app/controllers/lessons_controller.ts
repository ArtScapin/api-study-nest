import AccessLog from '#models/access_log'
import Lesson from '#models/lesson'
import Course from '#models/course'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { createLessonValidator, updateLessonValidator } from '#validators/lesson'

export default class LessonsController {
  async index({ response, params, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const course = await Course.query()
        .where((query) => {
          query.where('visibility', true).orWhere('userId', user.id)
        })
        .andWhere('id', params.courseId)
        .firstOrFail()
      const lessons = await Lesson.query().where('courseId', course.id).orderBy('order')

      return response.ok(lessons)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async show({ response, params, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const course = await Course.query()
        .where((query) => {
          query.where('visibility', true).orWhere('userId', user.id)
        })
        .andWhere('id', params.courseId)
        .firstOrFail()
      const lesson = await Lesson.query()
        .where('id', params.lessonId)
        .andWhere('courseId', course.id)
        .firstOrFail()

      await AccessLog.create({ userId: user.id, courseId: course.id, lessonId: lesson.id })

      return response.ok(lesson)
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
      const payload = await request.validateUsing(createLessonValidator)
      const course = await Course.findOrFail(params.courseId)
      const noPermission = this.verifyPermission(user, course)

      if (noPermission) return response.badRequest(noPermission)

      const lessons = await Lesson.query().where('courseId', course.id)
      const maxOrder = lessons.length + 1

      if (payload.order && payload.order < maxOrder && payload.order > 0) {
        await Lesson.query()
          .increment('order')
          .where('courseId', course.id)
          .andWhere('order', '>=', payload.order)
      } else {
        payload.order = maxOrder
      }

      const lesson = await Lesson.create({ ...payload, courseId: course.id })

      return response.ok(lesson)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async update({ request, response, params, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const payload = await request.validateUsing(updateLessonValidator)
      const course = await Course.findOrFail(params.courseId)
      const noPermission = this.verifyPermission(user, course)

      if (noPermission) return response.badRequest(noPermission)

      const lesson = await Lesson.query()
        .where('id', params.lessonId)
        .andWhere('courseId', course.id)
        .firstOrFail()
      const lessons = await Lesson.query().where('courseId', course.id)
      const maxOrder = lessons.length

      if (payload.order && payload.order <= maxOrder && payload.order > 0) {
        if (payload.order > lesson.order) {
          await Lesson.query()
            .decrement('order')
            .where('courseId', course.id)
            .andWhere('order', '<=', payload.order)
            .andWhere('order', '>', lesson.order)
        } else if (payload.order < lesson.order) {
          await Lesson.query()
            .increment('order')
            .where('courseId', course.id)
            .andWhere('order', '>=', payload.order)
            .andWhere('order', '<', lesson.order)
            .orderBy('order', 'desc')
        }
      }

      lesson.merge(payload)
      await lesson.save()

      return response.ok(lesson)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async destroy({ response, params, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const course = await Course.findOrFail(params.courseId)
      const noPermission = this.verifyPermission(user, course)

      if (noPermission) return response.badRequest(noPermission)

      const lesson = await Lesson.query()
        .where('id', params.lessonId)
        .andWhere('courseId', course.id)
        .firstOrFail()

      await lesson.delete()

      await Lesson.query()
        .decrement('order')
        .where('courseId', course.id)
        .andWhere('order', '>=', lesson.order)

      return response.noContent()
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
