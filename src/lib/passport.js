const passport =  require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../databases');
const helpers =  require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({ 
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true

},  async (req, username, password, done)=>{
   const filas = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      if(filas.length > 0)
      {
        const user = filas[0];
        const valida = await helpers.matchPassword(password, user.password);
        if(valida){
            done(null, user, req.flash('success','Welcome '+ user.username));
        }else{
            done(null,false, req.flash('message','Incorrect password'));
        }
      }else{
          return done(null, false, req.flash('message','The usrename does not exists'));
      }
}));


passport.use('local.signup',new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true 
}, async (req, username, password, done )=>{

    const {fullname} = req.body;
    const newUser = {
        username,
        password,
        fullname
    };

    newUser.password =  await helpers.encryptPassword(password);
    const result = await  db.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));
   
passport.serializeUser((user, done) =>{
 done(null, user.id);
});

passport.deserializeUser(async (id, done)=>{
 const filas = await db.query('SELECT * FROM users WHERE id = ? ',[id]);
 done(null,filas[0]);
});

