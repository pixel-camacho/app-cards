const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) =>{
  const salt = await bcrypt.genSalt(10);
  const hash =  await bcrypt.hash(password, salt);
  return hash;
};

helpers.matchPassword = async (password, savePassword) =>{
   try {
    return await bcrypt.compare(password, savePassword);
   } catch (e) {
       console.log(e);
   }
};

helpers.isLoggedIn = (req, res, next) =>{
   if(req.isAuthenticated())
   {
     return next();
   }
   return res.redirect('/signin');
}

helpers.isNotLoggedIn = (req, res , next) => {
  if(!req.isAuthenticated())
  {
    return next();
  }
  return res.redirect('/profile');
};

module.exports =  helpers;