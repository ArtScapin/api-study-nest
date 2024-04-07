import vine from '@vinejs/vine'

export const createCategoryValidator = vine.compile(
  vine.object({
    label: vine.string(),
  })
)

export const updateCategoryValidator = vine.compile(
  vine.object({
    label: vine.string(),
  })
)
