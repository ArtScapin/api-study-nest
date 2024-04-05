import vine from '@vinejs/vine'

export const createLessonValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(255),
    description: vine.string().maxLength(255).optional(),
    video: vine.string(),
    order: vine.number().optional(),
  })
)

export const updateLessonValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(255).optional(),
    description: vine.string().maxLength(255).optional(),
    video: vine.string().optional(),
    order: vine.number().optional(),
  })
)
