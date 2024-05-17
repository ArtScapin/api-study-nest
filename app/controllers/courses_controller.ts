import AccessLog from '#models/access_log'
import Course from '#models/course'
import User from '#models/user'
import {
  createCourseValidator,
  createRatingValidator,
  updateCourseValidator,
} from '#validators/course'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class CoursesController {
  async index({ response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const courses = await Course.query()
        .preload('user')
        .where('visibility', true)
        .orWhere('userId', user.id)

      return response.ok(courses)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async myCourses({ response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const courses = await Course.query().where('userId', user.id)

      return response.ok(courses)
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
        .preload('lessons')
        .preload('categories')
        .firstOrFail()

      await AccessLog.create({ userId: user.id, courseId: course.id })

      return response.ok(course)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const { name, description, thumbnail, visibility } =
        await request.validateUsing(createCourseValidator)

      const course = new Course()
      course.name = name
      course.description = description || null
      course.userId = user.id
      course.visibility = visibility

      if (thumbnail) {
        course.thumbnail = `${cuid()}.${thumbnail.extname}`
        await thumbnail.move(app.makePath('files/thumbnails'), { name: course.thumbnail })
      }

      await course.save()

      return response.ok(course)
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

  async update({ request, response, params, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const course = await Course.findOrFail(params.courseId)
      const noPermission = this.verifyPermission(user, course)

      if (noPermission) return response.badRequest(noPermission)

      const { thumbnail, ...payload } = await request.validateUsing(updateCourseValidator)

      course.merge(payload)

      if (thumbnail) {
        //TODO: Exclusão da thumbnail antiga
        course.thumbnail = `${cuid()}.${thumbnail.extname}`
        await thumbnail.move(app.makePath('files/thumbnails'), { name: course.thumbnail })
      }

      await course.save()

      return response.ok(course)
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

      if (course.thumbnail) {
        //TODO: Exclusão da thumbnail
      }

      await course.delete()

      return response.noContent()
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async rating({ request, response, params, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const course = await Course.findOrFail(params.courseId)
      const payload = await request.validateUsing(createRatingValidator)

      await course.related('ratings').sync(
        {
          [user.id]: payload,
        },
        false
      )

      return response.noContent()
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
