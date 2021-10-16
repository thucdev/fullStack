import db from '../models/index'
import CRUDService from '../services/CRUDSevice'

let getHomepage = async (req, res) => {
    try {
        let data = await db.User.findAll()
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
    res.redirect('/get-crud')
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
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id
    if (id) {
        await CRUDService.deleteUserById(id)

        res.redirect('/get-crud')
    } else {
        res.send('User not found')
    }
}

module.exports = {
    getHomepage: getHomepage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    editCRUD,
    putCRUD,
    deleteCRUD,
}
