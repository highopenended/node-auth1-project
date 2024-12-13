const router = require("express").Router()
const {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
} = require('./auth-middleware')
const bcrypt=require('bcryptjs')
const User = require("../users/users-model")


router.post('/register',checkUsernameFree,checkPasswordLength,(req,res,next)=>{  
  const {username, password}=req.body
  const hash = bcrypt.hashSync(password, 8) // 2 ^ 10
  User.add({username, password:hash})
    .then(saved=>{
      res.status(201).json(saved)
    })
    .catch(next)
})

router.post('/login',checkUsernameExists, (req,res,next)=>{
  const { password}=req.body
  const dbPass = req.user.password
  if(bcrypt.compareSync(password,dbPass)){
    // Make it so the cookie is set on the client
    // Make it so server stores a session with session id
    req.session.user = req.user
    console.log(req.session)
    res.status(201).json({ message: `Welcome ${req.user.username}`})
  }else{
    next({status:401,message:"Invalid credentials"})
  }
})


router.get('/logout',(req,res,next)=>{
  req.session.destroy()
  res.json('Auth Logout')
})

module.exports=router


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */


// Don't forget to add the router to the `exports` object so it can be required in other modules
