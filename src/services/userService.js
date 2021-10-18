import db from '../models/index'
import bcrypt from 'bcryptjs'
let salt = bcrypt.genSaltSync(10)

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkEmail(email)
            if (isExist) {
                let user = await db.User.findOne({
                    where: {email},
                    attributes: ['email', 'roleId', 'password'],
                    raw: true,
                })
                if (user) {
                    let check = await bcrypt.compare(password, user.password)
                    if (check) {
                        userData.errCode = 0
                        userData.errMessage = 'Oke'

                        delete user.password
                        userData.user = user
                    } else {
                        userData.errCode = 3
                        userData.errMessage = 'Wrong password'
                    }
                } else {
                    userData.errCode = 2
                    userData.errMessage = `User isn't exist!`
                }
            } else {
                userData.errCode = 1
                userData.errMessage = `Your email isn't exist in my system. Please try others`
            }
            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
}

let checkEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email},
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password'],
                    },
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude: ['password'],
                    },
                })
            }

            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exist
            let check = await checkEmail(data.email)
            if (check) {
                resolve({
                    errCode: 1,
                    message: `Your email is already in used. Please try another email`,
                })
            }
            let hashPW = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPW,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === 1 ? true : false,
                roleId: data.roleId,
            })
            resolve({
                errCode: 0,
                message: 'Create user succeed!',
            })
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

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: {id},
        })

        if (!user) {
            resolve({
                errCode: 2,
                errMessage: ` User isn't exist`,
            })
        }

        await db.User.destroy({
            where: {id},
        })
        resolve({
            errCode: 0,
            errMessage: ` User is deleted`,
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    message: `Missing required parameter`,
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id},
                raw: false,
            })
            if (user) {
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address

                await user.save()
                resolve({
                    errCode: 0,
                    message: `Update user succeed`,
                })
            } else {
                resolve({
                    errCode: 1,
                    message: `User not found`,
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    deleteUser,
    updateUserData,
}
