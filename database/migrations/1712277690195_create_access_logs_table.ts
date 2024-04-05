import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'access_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable()
      table.integer('course_id').notNullable()
      table.integer('lesson_id').nullable()
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.foreign('course_id').references('courses.id').onDelete('CASCADE')
      table.foreign('lesson_id').references('lessons.id').onDelete('CASCADE')
      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
