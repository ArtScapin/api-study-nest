import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import Lesson from './lesson.js'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare thumbnail: string | null

  @column({ serializeAs: null })
  declare userId: number

  @column()
  declare visibility: boolean

  @hasOne(() => User, {
    localKey: 'userId',
    foreignKey: 'id',
  })
  declare user: HasOne<typeof User>

  @hasMany(() => Lesson, {
    localKey: 'id',
    foreignKey: 'courseId',
  })
  declare lessons: HasMany<typeof Lesson>

  @manyToMany(() => User, {
    pivotTable: 'course_ratings',
  })
  declare ratings: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
