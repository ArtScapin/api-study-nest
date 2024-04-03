/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const UsersController = () => import('#controllers/users_controller')
import router from '@adonisjs/core/services/router'

router.get('/', () => {
  return { apiStudyNest: 'online' }
})

router
  .group(() => {
    router.get('', [UsersController, 'index'])
    router.get('/:userId', [UsersController, 'show'])
    router.post('/', [UsersController, 'store'])
    router.put('/:userId', [UsersController, 'update'])
    router.delete('/:userId', [UsersController, 'destroy'])
  })
  .prefix('user')
