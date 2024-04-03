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

router.group(() => {
  router.get('/user', [UsersController, 'index'])
  router.post('/user', [UsersController, 'store'])
})
