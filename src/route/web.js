import express, {Router} from 'express'
import homeController from '../controllers/homeController'

let router = express.Router()

let initWebRoutes = (app) => {
    router.get('/crud', homeController.getCRUD)
    router.post('/post-crud', homeController.postCRUD)
    router.get('/get-crud', homeController.displayGetCRUD)
    router.get('/edit-crud', homeController.editCRUD)
    router.post('/put-crud', homeController.putCRUD)
    router.get('/', homeController.getHomepage)

    return app.use('/', router)
}

module.exports = initWebRoutes
