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
const LessonsController = () => import('#controllers/lessons_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const CommentsController = () => import('#controllers/comments_controller')
const ContentsController = () => import('#controllers/contents_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', () => {
  return { apiStudyNest: 'online' }
})

router.group(() => {
  router.post('/login', [SessionController, 'store'])
  router.get('/session', [SessionController, 'show']).use(middleware.auth())
})

router
  .group(() => {
    router.post('/', [UsersController, 'store'])
    router
      .group(() => {
        router.get('/', [UsersController, 'index'])
        router.get('/:userId', [UsersController, 'show'])
        router.put('/:userId', [UsersController, 'update'])
        router.delete('/:userId', [UsersController, 'destroy'])
      })
      .use(middleware.auth())
  })
  .prefix('user')

router
  .group(() => {
    router.get('/', [CoursesController, 'index'])
    router.get('/:courseId', [CoursesController, 'show'])
    router.post('/', [CoursesController, 'store'])
    router.put('/:courseId', [CoursesController, 'update'])
    router.delete('/:courseId', [CoursesController, 'destroy'])

    router.post('/rating/:courseId', [CoursesController, 'rating'])
  })
  .prefix('course')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [LessonsController, 'index'])
    router.get('/:lessonId', [LessonsController, 'show'])
    router.post('/', [LessonsController, 'store'])
    router.put('/:lessonId', [LessonsController, 'update'])
    router.delete('/:lessonId', [LessonsController, 'destroy'])
  })
  .prefix('lesson/:courseId')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [CategoriesController, 'index'])
    router.get('/:categoryId', [CategoriesController, 'show'])
    router.post('/', [CategoriesController, 'store'])
    router.put('/:categoryId', [CategoriesController, 'update'])
    router.delete('/:categoryId', [CategoriesController, 'destroy'])

    router.post('/link/:categoryId/:courseId', [CategoriesController, 'link'])
    router.delete('/link/:categoryId/:courseId', [CategoriesController, 'unlink'])
  })
  .prefix('category')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/:lessonId', [CommentsController, 'index'])
    router.post('/:lessonId', [CommentsController, 'store'])
    router.delete('/:commentId', [CommentsController, 'destroy'])
  })
  .prefix('comment')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/:lessonId', [ContentsController, 'index'])
    router.post('/:lessonId', [ContentsController, 'store'])
    router.delete('/:contentId', [ContentsController, 'destroy'])
  })
  .prefix('content')
  .use(middleware.auth())
