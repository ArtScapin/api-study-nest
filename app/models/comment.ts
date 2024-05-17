import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Comment extends BaseModel {
  static table = 'lesson_comments'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare lessonId: number

  @column()
  declare text: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
