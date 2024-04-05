import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Lesson extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare video: string

  @column()
  declare order: number

  @column({ serializeAs: null })
  declare courseId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
