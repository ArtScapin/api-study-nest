import vine from '@vinejs/vine'

export const createContentValidator = vine.compile(
  vine.object({
    file: vine.file({ extnames: ['jpg', 'jpeg', 'png', 'pdf'] }),
  })
)
