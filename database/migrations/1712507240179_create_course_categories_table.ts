import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'course_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('course_id').notNullable()
      table.integer('category_id').notNullable()
      table.primary(['course_id', 'category_id'])
      table.foreign('course_id').references('courses.id').onDelete('CASCADE')
      table.foreign('category_id').references('categories.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
