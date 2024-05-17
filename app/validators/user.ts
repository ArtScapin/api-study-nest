import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(4).maxLength(255),
    email: vine.string().email(),
    password: vine.string().minLength(6).maxLength(32),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(4).maxLength(255).optional(),
    email: vine.string().email().optional(),
    password: vine.string().minLength(6).maxLength(32).optional(),
  })
)
