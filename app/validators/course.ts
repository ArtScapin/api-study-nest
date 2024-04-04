import vine from '@vinejs/vine'

export const createCourseValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(255),
    description: vine.string().maxLength(255).optional(),
    thumbnail: vine.file({ extnames: ['jpg', 'jpeg', 'png'] }).optional(),
    visibility: vine.boolean(),
  })
)

export const updateCourseValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(255).optional(),
    description: vine.string().maxLength(255).optional(),
    thumbnail: vine.file({ extnames: ['jpg', 'jpeg', 'png'] }).optional(),
    visibility: vine.boolean().optional(),
  })
)
