const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')

router.post('/user', userController.addUser)
router.delete('/user/:id_user', userController.deleteUser)
router.put('/user/:id_user', userController.updateUser)
router.put('/resend/user/:date', userController.resendAllMessage)

module.exports = router
