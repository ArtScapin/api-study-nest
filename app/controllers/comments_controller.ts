import Comment from '#models/comment'
import Course from '#models/course'
import Lesson from '#models/lesson'
import { createCommentValidator } from '#validators/comment'
import type { HttpContext } from '@adonisjs/core/http'

export default class CommentsController {
  private async verifyPermissionCourse(userId: number, courseId: number) {
    return await Course.query()
      .where((query) => {
        query.where('visibility', true).orWhere('userId', userId)
      })
      .andWhere('id', courseId)
      .firstOrFail()
  }

  async index({ response, params, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const lesson = await Lesson.findOrFail(params.lessonId)
      await this.verifyPermissionCourse(user.id, lesson.courseId)

      const comments = await Comment.query().where('lessonId', lesson.id)

      return response.ok(comments)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async store({ request, response, params, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const lesson = await Lesson.findOrFail(params.lessonId)
      await this.verifyPermissionCourse(user.id, lesson.courseId)

      const { text } = await request.validateUsing(createCommentValidator)

      const comment = await Comment.create({
        userId: user.id,
        lessonId: lesson.id,
        text,
      })

      await comment.load('user')

      return response.ok(comment)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async destroy({ response, params, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const comment = await Comment.findOrFail(params.commentId)

      if (comment.userId !== user.id)
        return response.badRequest({
          errors: [
            {
              message: 'Unauthorized access',
            },
          ],
        })

      await comment.delete()

      return response.noContent()
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
