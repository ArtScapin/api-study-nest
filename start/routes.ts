/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'

router.get('/', async () => {
  try {
    const response = await db.rawQuery('SELECT 1+1 as result')

    console.log('Conexão bem-sucedida com o banco de dados.')
    return response
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error)
  }
})
