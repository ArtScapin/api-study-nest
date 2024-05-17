import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Content from './content.js'

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

  @hasMany(() => Content, {
    localKey: 'id',
    foreignKey: 'lessonId',
  })
  declare contents: HasMany<typeof Content>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
