import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import User from './user.js'

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

  @hasOne(() => User, {
    localKey: 'userId',
    foreignKey: 'id'
  })
  declare user: HasOne<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
