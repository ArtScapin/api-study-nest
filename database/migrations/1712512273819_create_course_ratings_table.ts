import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'course_ratings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').notNullable()
      table.integer('course_id').notNullable()
      table.float('rating').notNullable()
      table.primary(['user_id', 'course_id'])
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.foreign('course_id').references('courses.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
