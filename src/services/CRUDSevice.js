import db from '../models/index'
import bcrypt from 'bcryptjs'
let salt = bcrypt.genSaltSync(10)

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPW = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPW,
                firstName: data.firstName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === 1 ? true : false,
                roleId: data.roleId,
            })
            resolve('create new user succeed!')
        } catch (error) {
            reject(error)
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt)
            resolve(hashPassword)
        } catch (error) {
            reject(error)
        }
    })
}

let getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,
            })
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId},
                raw: true,
            })

            if (user) {
                resolve(user)
            } else {
                resolve({})
            }
        } catch (error) {
            reject(error)
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: data.id},
            })
            if (user) {
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address

                await user.save()
                resolve()
            } else {
                resolve()
            }
        } catch (error) {
            // reject(error)
            console.log(error)
        }
    })
}

// let updateUserData = (data) => {
//     return new Promise(async (resolve, reject) => {
//         try {

//         } catch (error) {
//             console.log(error);
//         }
//     })

// }

module.exports = {
    createNewUser: createNewUser,
    getAllUsers,
    getUserInfoById,
    updateUserData,
}
