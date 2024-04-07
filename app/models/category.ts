import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Course from './course.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare label: string

  @manyToMany(() => Course, {
    pivotTable: 'course_categories',
  })
  declare courses: ManyToMany<typeof Course>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
