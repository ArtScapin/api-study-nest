import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AccessLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare courseId: number

  @column()
  declare lessonId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
