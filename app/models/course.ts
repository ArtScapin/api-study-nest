import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'

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

  @hasOne(() => User)
  declare user: HasOne<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'course_ratings',
  })
  declare ratings: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
