/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const UsersController = () => import('#controllers/users_controller')
const SessionController = () => import('#controllers/session_controller')
const CoursesController = () => import('#controllers/courses_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', () => {
  return { apiStudyNest: 'online' }
})

router.group(() => {
  router.post('/login', [SessionController, 'store'])
})

router
  .group(() => {
    router.get('/', [UsersController, 'index'])
    router.get('/:userId', [UsersController, 'show'])
    router.post('/', [UsersController, 'store'])
    router.put('/:userId', [UsersController, 'update'])
    router.delete('/:userId', [UsersController, 'destroy'])
  })
  .prefix('user')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [CoursesController, 'index'])
    router.get('/:courseId', [CoursesController, 'show'])
    router.post('/', [CoursesController, 'store'])
    router.put('/:courseId', [CoursesController, 'update'])
    router.delete('/:courseId', [CoursesController, 'destroy'])
  })
  .prefix('course')
  .use(middleware.auth())
