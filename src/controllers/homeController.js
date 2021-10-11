import db from '../models/index'
import CRUDService from '../services/CRUDSevice'

let getHomepage = async (req, res) => {
    try {
        let data = await db.User.findAll()
        console.log(data)
        return res.render('homepage.ejs', {
            data: JSON.stringify(data),
        })
    } catch (error) {
        console.log(error)
    }
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

let putCRUD = async (req, res) => {
    let data = req.body
    await CRUDService.updateUserData(data)
    console.log(data)
    return res.redirect('/get-crud')
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUsers()
    res.render('displayCRUD.ejs', {
        dataTable: data,
    })
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body)
    console.log(message)
    res.send('post from server')
}

let editCRUD = async (req, res) => {
    let user = req.query.id
    if (user) {
        let userData = await CRUDService.getUserInfoById(user)

        return res.render('editCRUD.ejs', {
            userData,
        })
    } else {
        res.send('User not found')
    }

    console.log(req.query.id)
}

module.exports = {
    getHomepage: getHomepage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    editCRUD,
    putCRUD,
}
