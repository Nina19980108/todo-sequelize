const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const users = require('./modules/users')
const todos = require('./modules/todos')

router.use('/', home)
router.use('/users', users)
router.use('/todos', todos)

module.exports = router