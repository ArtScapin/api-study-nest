import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Content extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare file: string

  @column({ serializeAs: null })
  declare lessonId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
