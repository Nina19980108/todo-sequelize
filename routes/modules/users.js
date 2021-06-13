const express = require('express')
const passport = require('passport')
const router = express.Router()
const db = require('../../models')
const User = db.User

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push('Every space is required！')
  }
  if (password !== confirmPassword) {
    errors.push('Password and Confirm Password are different!')
  }
  if (errors.length) return res.render('register', {
    name,
    email,
    password,
    confirmPassword,
    errors
  })
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      errors.push('User already exists!')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword,
        errors
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', "You've successfully logged out.")
  res.redirect('/users/login')
})

module.exports = router