
const User=require('../users/users-model')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  next()
}

async function checkUsernameFree(req, res, next) {
  try{
    const users = await User.findBy({username:req.body.username})
    if(!users || !users.length){
      next()
    }else{
      next({message:"Username taken", status:422})
    }
  }catch(err){
    next(err)
  }
}

async function checkUsernameExists(req, res, next) {
  try{
    const users = await User.findBy({username:req.body.username})
    if(users.length){
      req.user=users[0]
      next()
    }else{
      next({message:"Invalid credentials", status:401})
    }
  }catch(err){
    next(err)
  }
}


function checkPasswordLength(req, res, next) {
  try{
    if(!req.body.password || req.body.password.length<=3){
      next({message:"Password must be longer than 3 chars", status:422})
      next()
    }else{
      next()
    }
  }catch(err){
    next(err)
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports={
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}