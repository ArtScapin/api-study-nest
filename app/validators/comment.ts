import vine from '@vinejs/vine'

export const createCommentValidator = vine.compile(
  vine.object({
    text: vine.string(),
    created_at: vine.date().optional(),
  })
)
